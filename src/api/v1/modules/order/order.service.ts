import * as crypto from 'crypto';

import { HttpService } from '@nestjs/axios';
import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VoucherType } from '@prisma/client';
import { Request, Response } from 'express';
import * as moment from 'moment';
import * as querystring from 'qs';

import { PrismaService } from '@/prisma/prisma.service';
import {
    ORDER_CANCEL_SELECT,
    ORDER_FULL_SELECT,
    ORDER_PRODUCT_OPTION_WITH_SPECS_SELECT,
    ORDER_UPDATE_STATUS_SELECT,
} from '@/prisma/selectors';
import { CreateOrderComboDto } from '@v1/modules/order/dto/create-order-combo';
import {
    CalculateShippingFee,
    GHTKCancelResponse,
    GHTKCreateResponse,
    GHTKShippingFeeResponse,
    OrderDBResponse,
    OrderResponse,
    OrderStatus,
} from '@v1/modules/order/types';
import { UserService } from '@v1/modules/user/user.service';
import { VoucherService } from '@v1/modules/voucher/voucher.service';

import {
    AdminUpdateOrderStatusDto,
    CalculateShippingFeeDto,
    UpdateOrderStatusDto,
    UpdatePaymentStatusDto,
} from './dto';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly voucherService: VoucherService,
    ) {}

    async create(userId: string, createOrderDto: CreateOrderDto) {
        const user = await this.prismaService.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const {
            delivery_id,
            payment_method,
            order_details,
            name,
            phone,
            note,
            voucherCodes,
            ...orderAddress
        } = createOrderDto;

        const deliveryService = await this.prismaService.delivery.findUnique({
            where: { id: delivery_id },
        });

        if (!deliveryService) {
            throw new NotFoundException('Delivery service not found');
        }

        const result = await this.prismaService.$transaction(async prisma => {
            const order = await prisma.order.create({
                data: {
                    user_id: userId,
                    order_date: new Date(),
                    name,
                    phone,
                    note,
                },
            });

            if (!order) {
                throw new UnprocessableEntityException(`Cannot create order`);
            }

            let totalOrderPrice = 0;
            const productOptionThumbs: {
                product_option: { thumbnail: string };
            }[] = [];

            const orderDetailPromises = order_details.map(async orderDetail => {
                const { product_option_id, quantity } = orderDetail;

                const userCart = await prisma.cart.findFirst({
                    where: {
                        user_id: userId,
                        product_option_id,
                        quantity: { gte: 1 },
                    },
                });

                if (!userCart) {
                    throw new NotFoundException('Product does not exist in cart');
                }

                const productOption = await prisma.productOption.findUnique({
                    where: { id: product_option_id, stock: { gte: 1 } },
                    select: {
                        thumbnail: true,
                        stock: true,
                        discount: true,
                        price_modifier: true,
                        product: {
                            select: { price: true },
                        },
                    },
                });

                if (!productOption) {
                    throw new UnprocessableEntityException(
                        'There are not enough products left, please try again',
                    );
                }

                if (userCart.quantity < quantity) {
                    throw new UnprocessableEntityException(
                        'The number of products in the shopping cart is not enough, please try again',
                    );
                }

                productOptionThumbs.push({
                    product_option: {
                        thumbnail: productOption.thumbnail,
                    },
                });

                if (userCart.quantity - quantity === 0) {
                    await prisma.cart.delete({
                        where: {
                            id: userCart.id,
                        },
                    });
                } else {
                    await prisma.cart.update({
                        where: {
                            id: userCart.id,
                        },
                        data: {
                            quantity: userCart.quantity - quantity,
                        },
                    });
                }

                await prisma.productOption.update({
                    where: {
                        id: product_option_id,
                        stock: { gte: 1 },
                    },
                    data: { stock: productOption.stock - quantity },
                });

                const discount =
                    ((productOption.product.price + productOption.price_modifier) *
                        productOption.discount) /
                    100;
                const modifiedPrice =
                    productOption.product.price + productOption.price_modifier - discount;
                const subtotal = quantity * modifiedPrice;

                totalOrderPrice += subtotal;

                return prisma.orderDetail.create({
                    data: {
                        order_id: order.id,
                        product_option_id,
                        price: modifiedPrice,
                        quantity,
                        subtotal,
                    },
                });
            });
            const GHTKOrder = await this.createGHTKOrder(order.id, createOrderDto);

            if (!GHTKOrder?.success) {
                throw new UnprocessableEntityException(GHTKOrder.message);
            }

            const updateShippingFee = prisma.order.update({
                where: { id: order.id },
                data: { total_amount: totalOrderPrice + GHTKOrder.order.fee },
            });

            const orderShipping = prisma.orderShipping.create({
                data: {
                    order_id: order.id,
                    delivery_id,
                    estimate_date: GHTKOrder.order.estimated_deliver_time,
                    tracking_number: String(GHTKOrder.order.tracking_id),
                    order_label: GHTKOrder.order.label,
                    fee: GHTKOrder.order.fee,
                    ...orderAddress,
                },
            });

            const payment = prisma.payment.create({
                data: {
                    order_id: order.id,
                    payment_method,
                    transaction_id: null,
                    total_price: totalOrderPrice + GHTKOrder.order.fee,
                },
            });

            await Promise.all([payment, orderShipping, updateShippingFee, ...orderDetailPromises]);

            return {
                is_success: true,
                total_order_price: totalOrderPrice,
                GKTK_order_fee: GHTKOrder.order.fee,
                order_id: order.id,
                GHTK_tracking_number: GHTKOrder.order.tracking_id,
                payment_id: (await payment).id,
                userId,
                order_details: [...productOptionThumbs],
            };
        });

        if (voucherCodes.length > 0) {
            let totalOrderPrice = result.total_order_price + result.GKTK_order_fee;
            for (const code of voucherCodes) {
                const voucher = await this.voucherService.applyVoucherToOrder(
                    result.order_id,
                    code,
                );
                if (voucher.type === VoucherType.FIXED) {
                    totalOrderPrice -= voucher.value;
                } else {
                    const percent = voucher.value;
                    totalOrderPrice -= (totalOrderPrice * percent) / 100;
                }
            }

            const updateOrderPricePromise = this.prismaService.order.update({
                where: { id: result.order_id },
                data: { total_amount: totalOrderPrice },
            });

            const updatePaymentPricePromise = this.prismaService.payment.update({
                where: { id: result.payment_id },
                data: { total_price: totalOrderPrice },
            });

            await Promise.all([updateOrderPricePromise, updatePaymentPricePromise]);
        }

        return result;
    }

    async createOrderCombo(userId: string, createOrderComboDto: CreateOrderComboDto) {
        const user = await this.prismaService.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const {
            delivery_id,
            payment_method,
            productComboIds,
            name,
            phone,
            note,
            voucherCodes,
            productOptionId,
            ...orderAddress
        } = createOrderComboDto;

        const deliveryService = await this.prismaService.delivery.findUnique({
            where: { id: delivery_id },
        });

        if (!deliveryService) {
            throw new NotFoundException('Delivery service not found');
        }

        const productComboPromises = productComboIds.map(id =>
            this.prismaService.productCombo.findUnique({
                where: { id },
                select: {
                    product_option_id: true,
                    discount: true,
                    combo_id: true,
                },
            }),
        );

        const order_details = await Promise.all(productComboPromises);

        const result = await this.prismaService.$transaction(async prisma => {
            const order = await prisma.order.create({
                data: {
                    user_id: userId,
                    order_date: new Date(),
                    name,
                    phone,
                    note,
                },
            });

            if (!order) {
                throw new UnprocessableEntityException(`Cannot create order`);
            }

            const orderCombo = await prisma.orderCombo.create({
                data: {
                    order_id: order.id,
                    combo_id: order_details[0].combo_id,
                },
            });

            if (!orderCombo) {
                throw new UnprocessableEntityException(`Cannot create order combo`);
            }

            let totalOrderPrice = 0;
            const productOptionThumbs: {
                product_option: { thumbnail: string };
            }[] = [];

            const orderDetailPromises = [
                { product_option_id: productOptionId, discount: 0 },
                ...order_details,
            ].map(async orderDetail => {
                const { product_option_id, discount } = orderDetail;

                const productOption = await prisma.productOption.findUnique({
                    where: { id: product_option_id, stock: { gte: 1 } },
                    select: {
                        thumbnail: true,
                        stock: true,
                        discount: true,
                        price_modifier: true,
                        product: {
                            select: { price: true },
                        },
                    },
                });

                if (!productOption) {
                    throw new UnprocessableEntityException(
                        'There are not enough products left, please try again',
                    );
                }

                productOptionThumbs.push({
                    product_option: {
                        thumbnail: productOption.thumbnail,
                    },
                });

                await prisma.productOption.update({
                    where: {
                        id: product_option_id,
                        stock: { gte: 1 },
                    },
                    data: { stock: productOption.stock - 1 },
                });

                const discountPercent =
                    product_option_id === productOptionId ? productOption.discount : discount;
                const originalPrice = productOption.product.price + productOption.price_modifier;
                const discountPrice = (originalPrice * discountPercent) / 100;
                const modifiedPrice = originalPrice - discountPrice;

                totalOrderPrice += modifiedPrice;

                return prisma.orderDetail.create({
                    data: {
                        order_id: order.id,
                        product_option_id,
                        price: modifiedPrice,
                        quantity: 1,
                        subtotal: modifiedPrice,
                    },
                });
            });

            const GHTKOrder = await this.createGHTKOrder(order.id, {
                ...createOrderComboDto,
                order_details: [
                    { product_option_id: productOptionId, quantity: 1 },
                    ...order_details.map(item => ({
                        product_option_id: item.product_option_id,
                        quantity: 1,
                    })),
                ],
            });

            if (!GHTKOrder?.success) {
                throw new UnprocessableEntityException(GHTKOrder.message);
            }

            const updateShippingFee = prisma.order.update({
                where: { id: order.id },
                data: { total_amount: totalOrderPrice + GHTKOrder.order.fee },
            });

            const orderShipping = prisma.orderShipping.create({
                data: {
                    order_id: order.id,
                    delivery_id,
                    estimate_date: GHTKOrder.order.estimated_deliver_time,
                    tracking_number: String(GHTKOrder.order.tracking_id),
                    order_label: GHTKOrder.order.label,
                    fee: GHTKOrder.order.fee,
                    ...orderAddress,
                },
            });

            const payment = prisma.payment.create({
                data: {
                    order_id: order.id,
                    payment_method,
                    transaction_id: null,
                    total_price: totalOrderPrice + GHTKOrder.order.fee,
                },
            });

            await Promise.all([payment, orderShipping, updateShippingFee, ...orderDetailPromises]);

            return {
                is_success: true,
                total_order_price: totalOrderPrice,
                GKTK_order_fee: GHTKOrder.order.fee,
                order_id: order.id,
                GHTK_tracking_number: GHTKOrder.order.tracking_id,
                payment_id: (await payment).id,
                userId,
                order_details: [...productOptionThumbs],
            };
        });

        if (voucherCodes.length > 0) {
            let totalOrderPrice = result.total_order_price + result.GKTK_order_fee;
            for (const code of voucherCodes) {
                const voucher = await this.voucherService.applyVoucherToOrder(
                    result.order_id,
                    code,
                );
                if (voucher.type === VoucherType.FIXED) {
                    totalOrderPrice -= voucher.value;
                } else {
                    const percent = voucher.value;
                    totalOrderPrice -= (totalOrderPrice * percent) / 100;
                }
            }

            const updateOrderPricePromise = this.prismaService.order.update({
                where: { id: result.order_id },
                data: { total_amount: totalOrderPrice },
            });

            const updatePaymentPricePromise = this.prismaService.payment.update({
                where: { id: result.payment_id },
                data: { total_price: totalOrderPrice },
            });

            await Promise.all([updateOrderPricePromise, updatePaymentPricePromise]);
        }

        return result;
    }

    async cancel(userId: string, id: string) {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const order = await this.prismaService.order.findUnique({
            where: { id, user_id: user.id },
            select: {
                status: true,
                shipping: {
                    select: {
                        order_label: true,
                    },
                },
            },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (order.status !== OrderStatus.PENDING) {
            throw new ForbiddenException('Order cannot be canceled');
        }

        const isUpdated = await this.prismaService.order.update({
            where: { id, status: OrderStatus.PENDING },
            data: { status: OrderStatus.CANCEL },
            select: ORDER_CANCEL_SELECT,
        });

        if (!isUpdated) {
            throw new NotFoundException('Order not found or cannot be canceled');
        }

        const GHTKCancel = await this.cancelGHTKOrder(order.shipping.order_label);
        if (!GHTKCancel?.success) {
            throw new InternalServerErrorException('Internal server error');
        }

        return {
            is_success: true,
            userId: isUpdated.user_id,
            transaction_id: isUpdated.payment.transaction_id,
            order_details: isUpdated.order_details,
        };
    }

    async findById(userId: string, id: string): Promise<OrderResponse> {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const order = await this.prismaService.order.findUnique({
            where: { id, user_id: user.id },
            select: ORDER_FULL_SELECT,
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return this.convertOrderResponse(order);
    }

    async findAll(): Promise<OrderResponse[]> {
        const orders = await this.prismaService.order.findMany({
            select: ORDER_FULL_SELECT,
        });

        return orders.map(order => this.convertOrderResponse(order));
    }

    async getAllByAdmin(): Promise<OrderResponse[]> {
        const orders = await this.prismaService.order.findMany({
            select: ORDER_FULL_SELECT,
        });

        return orders.map(order => this.convertOrderResponse(order));
    }

    async findByStatus(userId: string, status: number): Promise<OrderResponse[]> {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const orders = await this.prismaService.order.findMany({
            where: {
                user_id: user.id,
                ...(status && status === 5
                    ? {}
                    : {
                          status,
                      }),
            },
            select: ORDER_FULL_SELECT,
            orderBy: {
                created_at: 'desc',
            },
        });

        return orders.map(order => this.convertOrderResponse(order));
    }

    async updatePaymentStatus(id: string, updatePaymentStatusDto: UpdatePaymentStatusDto) {
        const { transaction_id } = updatePaymentStatusDto;
        const isExist = await this.prismaService.payment.findUnique({
            where: { id },
        });
        if (!isExist) {
            throw new NotFoundException('Payment not found');
        }

        const isUpdated = await this.prismaService.payment.update({
            where: { id },
            data: { transaction_id },
        });

        return {
            is_success: isUpdated ? true : false,
        };
    }

    async updateStatus(id: string, userId: string, updateOrderStatusDto: UpdateOrderStatusDto) {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const order = await this.prismaService.order.findUnique({
            where: { id, user_id: user.id },
            select: { status: true },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (order.status === OrderStatus.CANCEL) {
            throw new ForbiddenException('Order has been canceled');
        }

        if (order.status === OrderStatus.RECEIVED) {
            throw new ForbiddenException('Order has been completed');
        }

        if (updateOrderStatusDto.status === OrderStatus.CANCEL) {
            return this.cancel(userId, id);
        }

        const updatedOrder = await this.prismaService.order.update({
            where: { id },
            data: { status: updateOrderStatusDto.status },
            select: ORDER_UPDATE_STATUS_SELECT,
        });

        return updatedOrder;
    }

    async updateStatusByAdmin(id: string, updateOrderStatusDto: AdminUpdateOrderStatusDto) {
        const order = await this.prismaService.order.findUnique({
            where: { id },
            select: {
                shipping: true,
            },
        });
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        const isUpdated = await this.prismaService.order.update({
            where: { id },
            data: { status: updateOrderStatusDto.status },
            select: {
                order_details: {
                    select: {
                        product_option: {
                            select: {
                                thumbnail: true,
                            },
                        },
                    },
                },
                user_id: true,
                payment: {
                    select: {
                        transaction_id: true,
                    },
                },
            },
        });

        if (updateOrderStatusDto.status === OrderStatus.RECEIVED) {
            await this.cancelGHTKOrder(order.shipping.order_label);
        }

        return {
            is_success: isUpdated ? true : false,
            userId: isUpdated.user_id,
            transaction_id: isUpdated.payment.transaction_id,
            order_details: isUpdated.order_details,
        };
    }

    async calculateShippingFee(calculateShippingFeeDto: CalculateShippingFeeDto) {
        const GHTKShippingFee = await this.GHTKShippingFee(calculateShippingFeeDto);

        return {
            is_success: GHTKShippingFee.success,
            fee: GHTKShippingFee.fee.fee,
            delivery: GHTKShippingFee.fee.delivery,
            include_vat: GHTKShippingFee.fee.include_vat,
        };
    }

    async vnpayCreatePayment(req: Request, res: Response) {
        const date = new Date();
        const createDate = moment(date).format('YYYYMMDDHHmmss');

        const ipAddr =
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection['socket'].remoteAddress;

        const tmnCode = this.configService.get('vnp_TmnCode');
        const secretKey = this.configService.get('vnp_HashSecret');
        let vnpUrl = this.configService.get('vnp_Url');
        const returnUrl = this.configService.get('vnp_ReturnUrl');
        const orderId = moment(date).format('DDHHmmss');
        const amount = req.body.amount;
        const bankCode = req.body.bankCode;

        let locale = req.body.language;
        if (locale === null || locale === '') {
            locale = 'vn';
        }
        const currCode = 'VND';
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;

        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = this.sortObject(vnp_Params);

        const signData = querystring.stringify(vnp_Params, { encode: false });

        const hmac = crypto.createHmac('sha512', secretKey);
        // const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        const signed = hmac.update(signData).digest('hex');
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

        return res.status(200).json({ payment_url: vnpUrl });
    }

    private sortObject(obj) {
        const sorted = {};
        const str = [];
        let key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
        }
        return sorted;
    }

    private async createGHTKOrder(
        orderId: string,
        orderData: CreateOrderDto,
    ): Promise<GHTKCreateResponse> {
        const products: {
            name: string;
            weight: number;
            quantity: number;
        }[] = [];

        let totalPrice = 0;

        for (const orderDetailItem of orderData.order_details) {
            const productOption = await this.prismaService.productOption.findUnique({
                where: { id: orderDetailItem.product_option_id },
                select: ORDER_PRODUCT_OPTION_WITH_SPECS_SELECT,
            });

            const discount =
                ((productOption.product.price + productOption.price_modifier) *
                    productOption.discount) /
                100;
            const modifiedPrice =
                productOption.product.price + productOption.price_modifier - discount;
            const subtotal = orderDetailItem.quantity * modifiedPrice;

            totalPrice += subtotal;

            let weight = 500;
            if (
                productOption.technical_specs?.specs &&
                productOption.technical_specs.specs.length > 0
            ) {
                const weightSpec = productOption.technical_specs.specs[0];
                if (weightSpec && weightSpec.value) {
                    const weightValue = weightSpec.value.replace(/[^0-9.]/g, '');
                    weight = parseFloat(weightValue) * 1000 || 500;
                }
            }

            products.push({
                name: productOption.product.name,
                weight,
                quantity: orderDetailItem.quantity,
            });
        }

        const GHTKOrderObj = {
            id: orderId,
            pick_name: this.configService.get<string>('GHTK_PICK_NAME'),
            pick_address: this.configService.get<string>('GHTK_PICK_ADDRESS'),
            pick_province: this.configService.get<string>('GHTK_PICK_PROVINCE'),
            pick_district: this.configService.get<string>('GHTK_PICK_DISTRICT'),
            pick_ward: this.configService.get<string>('GHTK_PICK_WARD'),
            pick_tel: this.configService.get<string>('GHTK_PICK_TEL'),
            tel: orderData.phone,
            name: orderData.name,
            address: orderData.address,
            province: orderData.province,
            district: orderData.district,
            ward: orderData.ward,
            hamlet: orderData.hamlet,
            pick_date: new Date().toISOString().split('T')[0],
            pick_money: Math.round(totalPrice),
            note: orderData.note,
            value: Math.round(totalPrice),
            transport: 'road',
            tags: [1, 2],
        };

        const response = await this.httpService.axiosRef({
            method: 'POST',
            url: `${this.configService.get('GHTK_API_URL')}/shipment/order`,
            data: {
                products,
                order: GHTKOrderObj,
            },
            headers: {
                'Content-Type': 'application/json',
                Token: this.configService.get<string>('GHTK_API_TOKEN_KEY'),
            },
        });

        return response.data;
    }

    private async cancelGHTKOrder(label: string): Promise<GHTKCancelResponse> {
        if (!label) {
            throw new NotFoundException('Missing order label');
        }

        const response = await this.httpService.axiosRef({
            method: 'POST',
            url: `${this.configService.get('GHTK_API_URL')}/shipment/cancel/${label}`,
            headers: {
                'Content-Type': 'application/json',
                Token: this.configService.get<string>('GHTK_API_TOKEN_KEY'),
            },
        });

        return response.data;
    }

    private async GHTKShippingFee(
        calculateShippingFee: CalculateShippingFee,
    ): Promise<GHTKShippingFeeResponse> {
        const response = await this.httpService.axiosRef({
            method: 'POST',
            url: `${this.configService.get('GHTK_API_URL')}/shipment/fee`,
            headers: {
                'Content-Type': 'application/json',
                Token: this.configService.get<string>('GHTK_API_TOKEN_KEY'),
            },
            data: {
                pick_province: this.configService.get<string>('GHTK_PICK_PROVINCE'),
                pick_district: this.configService.get<string>('GHTK_PICK_DISTRICT'),
                pick_ward: this.configService.get<string>('GHTK_PICK_WARD'),
                province: calculateShippingFee.province,
                district: calculateShippingFee.district,
                ward: calculateShippingFee.ward,
                weight: calculateShippingFee.weight / 1000,
                value: calculateShippingFee.value,
                transport: 'road',
                tags: [1, 2],
            },
        });

        return response.data;
    }

    private convertOrderResponse(order: OrderDBResponse): OrderResponse {
        return {
            id: order.id,
            email: order.User.email,
            avatar: order.User.avatar,
            name: order.name,
            phone: order.phone,
            note: order.note,
            order_date: order.order_date,
            status: order.status,
            total_amount: order.total_amount,
            address: order.shipping.address,
            province: order.shipping.province,
            district: order.shipping.district,
            ward: order.shipping.ward,
            hamlet: order.shipping.hamlet,
            fee: order.shipping.fee,
            estimate_date: order.shipping.estimate_date,
            tracking_number: order.shipping.tracking_number,
            payment_method: order.payment.payment_method,
            transaction_id: order.payment.transaction_id,
            delivery: {
                name: order.shipping.delivery.name,
                slug: order.shipping.delivery.slug,
            },
            order_details: order.order_details.map(orderDetail => {
                return {
                    id: orderDetail.id,
                    product: {
                        id: orderDetail.product_option.id,
                        name: orderDetail.product_option.product.name,
                        sku: orderDetail.product_option.sku,
                        brand: {
                            id: orderDetail.product_option.product.brand.id,
                            name: orderDetail.product_option.product.brand.name,
                            slug: orderDetail.product_option.product.brand.slug,
                            logo_url: orderDetail.product_option.product.brand.logo_url,
                        },
                        category: {
                            id: orderDetail.product_option.product.category.id,
                            name: orderDetail.product_option.product.category.name,
                            slug: orderDetail.product_option.product.category.slug,
                        },
                        descriptions: orderDetail.product_option.product.descriptions.map(el => ({
                            id: el.id,
                            content: el.content,
                        })),
                        label: orderDetail.product_option.product.label,
                        price: orderDetail.product_option.product.price,
                        promotions: orderDetail.product_option.product.promotions,
                        warranties: orderDetail.product_option.product.warranties,
                        thumbnail: orderDetail.product_option.thumbnail,
                        options: orderDetail.product_option.product_option_value.map(el => ({
                            name: el.option.name,
                            value: el.value,
                            adjust_price: el.adjust_price,
                        })),
                        weight: Number(
                            orderDetail.product_option.technical_specs.specs[0].value.split(
                                ' g',
                            )[0],
                        ), // 188g
                        label_image: orderDetail.product_option.label_image,
                        price_modifier: orderDetail.product_option.price_modifier,
                        discount: orderDetail.product_option.discount,
                        slug: orderDetail.product_option.slug,
                    },
                    price: orderDetail.price,
                    quantity: orderDetail.quantity,
                    subtotal: orderDetail.subtotal,
                };
            }),
        };
    }
}
