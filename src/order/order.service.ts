import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import {
    CalculateShippingFee,
    GHTKCancelResponse,
    GHTKCreateResponse,
    GHTKShippingFeeResponse,
    OrderDBResponse,
    OrderResponse,
    OrderStatus,
} from './types';
import {
    CalculateShippingFeeDto,
    UpdateOrderStatusDto,
    UpdatePaymentStatusDto,
} from './dto';
import { Request, Response } from 'express';
import * as moment from 'moment';
import * as querystring from 'qs';
import * as crypto from 'crypto';

@Injectable()
export class OrderService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {}

    async create(userId: string, createOrderDto: CreateOrderDto) {
        return await this.prismaService.$transaction(async (prisma) => {
            const user = await prisma.user.findUnique({
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
                ...orderAddress
            } = createOrderDto;

            const deliveryService = await prisma.delivery.findUnique({
                where: { id: delivery_id },
            });

            if (!deliveryService) {
                throw new NotFoundException('Delivery service not found');
            }

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

            const orderDetailPromises = order_details.map(
                async (orderDetail) => {
                    const { product_option_id, price, quantity } = orderDetail;

                    const userCart = await prisma.cart.findFirst({
                        where: {
                            user_id: userId,
                            product_option_id,
                            quantity: { gte: 1 },
                        },
                    });

                    if (!userCart) {
                        throw new NotFoundException(
                            'Product does not exist in cart',
                        );
                    }

                    const productOption = await prisma.productOption.findUnique(
                        {
                            where: { id: product_option_id, stock: { gte: 1 } },
                            select: { stock: true },
                        },
                    );

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

                    totalOrderPrice += quantity * price;

                    return prisma.orderDetail.create({
                        data: {
                            order_id: order.id,
                            product_option_id,
                            price,
                            quantity,
                            subtotal: quantity * price,
                        },
                    });
                },
            );

            const GHTKOrder = await this.createGHTKOrder(
                order.id,
                createOrderDto,
            );

            if (!GHTKOrder?.success) {
                throw new UnprocessableEntityException(
                    `Cannot create GHTK order`,
                );
            }

            const payment = prisma.payment.create({
                data: {
                    order_id: order.id,
                    payment_method,
                    transaction_id: null,
                    total_price: totalOrderPrice + GHTKOrder.order.fee,
                },
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

            const updateShippingFee = prisma.order.update({
                where: { id: order.id },
                data: { total_amount: totalOrderPrice + GHTKOrder.order.fee },
            });

            await Promise.all([
                payment,
                orderShipping,
                updateShippingFee,
                ...orderDetailPromises,
            ]);

            return {
                is_success: true,
                order_id: order.id,
                GHTK_tracking_number: GHTKOrder.order.tracking_id,
                payment_id: (await payment).id,
            };
        });
    }

    async cancel(userId: string, id: string) {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const order = await this.prismaService.order.findUnique({
            where: { id, status: OrderStatus.PENDING },
            select: {
                id: true,
                status: true,
                shipping: {
                    select: { order_label: true },
                },
            },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        } else if (order.status === OrderStatus.SHIPPING) {
            throw new ForbiddenException('Order cannot be canceled');
        }

        const isUpdated = await this.prismaService.order.update({
            where: { id, status: OrderStatus.PENDING },
            data: { status: OrderStatus.CANCEL },
        });

        if (!isUpdated) {
            throw new NotFoundException(
                'Order not found or cannot be canceled',
            );
        }

        const GHTKCancel = await this.cancelGHTKOrder(
            order.shipping.order_label,
        );
        if (!GHTKCancel?.success) {
            throw new InternalServerErrorException('Internal server error');
        }

        return {
            is_success: true,
            order_id: order.id,
        };
    }

    async findById(userId: string, id: string): Promise<OrderResponse> {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const order = await this.prismaService.order.findUnique({
            where: { id, user_id: user.id },
            select: {
                id: true,
                name: true,
                phone: true,
                note: true,
                order_date: true,
                status: true,
                total_amount: true,
                shipping: {
                    select: {
                        id: true,
                        address: true,
                        province: true,
                        district: true,
                        ward: true,
                        hamlet: true,
                        fee: true,
                        estimate_date: true,
                        tracking_number: true,
                    },
                },
                payment: {
                    select: {
                        id: true,
                        payment_method: true,
                        total_price: true,
                        transaction_id: true,
                    },
                },
                order_details: {
                    select: {
                        id: true,
                        product_option: {
                            select: {
                                id: true,
                                sku: true,
                                product: {
                                    select: {
                                        id: true,
                                        name: true,
                                        brand: {
                                            select: {
                                                id: true,
                                                name: true,
                                                slug: true,
                                                logo_url: true,
                                            },
                                        },
                                        category: {
                                            select: {
                                                id: true,
                                                name: true,
                                                slug: true,
                                            },
                                        },
                                        descriptions: {
                                            select: {
                                                id: true,
                                                content: true,
                                            },
                                        },
                                        label: true,
                                        price: true,
                                        promotions: true,
                                        warranties: true,
                                    },
                                },
                                thumbnail: true,
                                product_option_value: {
                                    select: {
                                        option: {
                                            select: {
                                                name: true,
                                            },
                                        },
                                        value: true,
                                        adjust_price: true,
                                    },
                                },
                                technical_specs: {
                                    select: {
                                        weight: true,
                                    },
                                },
                                label_image: true,
                                price_modifier: true,
                                discount: true,
                                slug: true,
                            },
                        },
                        price: true,
                        quantity: true,
                        subtotal: true,
                    },
                },
            },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return this.convertOrderResponse(order);
    }

    async findByStatus(
        userId: string,
        status: number,
    ): Promise<OrderResponse[]> {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const orders = (await this.prismaService.order.findMany({
            where: {
                user_id: user.id,
                ...(status && status === 5
                    ? {}
                    : {
                          status,
                      }),
            },
            select: {
                id: true,
                name: true,
                phone: true,
                note: true,
                order_date: true,
                status: true,
                total_amount: true,
                shipping: {
                    select: {
                        id: true,
                        address: true,
                        province: true,
                        district: true,
                        ward: true,
                        hamlet: true,
                        fee: true,
                        estimate_date: true,
                        tracking_number: true,
                    },
                },
                payment: {
                    select: {
                        id: true,
                        payment_method: true,
                        total_price: true,
                        transaction_id: true,
                    },
                },
                order_details: {
                    select: {
                        id: true,
                        product_option: {
                            select: {
                                id: true,
                                sku: true,
                                product: {
                                    select: {
                                        id: true,
                                        name: true,
                                        brand: {
                                            select: {
                                                id: true,
                                                name: true,
                                                slug: true,
                                                logo_url: true,
                                            },
                                        },
                                        category: {
                                            select: {
                                                id: true,
                                                name: true,
                                                slug: true,
                                            },
                                        },
                                        descriptions: {
                                            select: {
                                                id: true,
                                                content: true,
                                            },
                                        },
                                        label: true,
                                        price: true,
                                        promotions: true,
                                        warranties: true,
                                    },
                                },
                                thumbnail: true,
                                product_option_value: {
                                    select: {
                                        option: {
                                            select: {
                                                name: true,
                                            },
                                        },
                                        value: true,
                                        adjust_price: true,
                                    },
                                },
                                technical_specs: {
                                    select: {
                                        weight: true,
                                    },
                                },
                                label_image: true,
                                price_modifier: true,
                                discount: true,
                                slug: true,
                            },
                        },
                        price: true,
                        quantity: true,
                        subtotal: true,
                    },
                },
            },
        })) as OrderDBResponse[];

        return orders.map((order) => this.convertOrderResponse(order));
    }

    async updatePaymentStatus(
        id: string,
        updatePaymentStatusDto: UpdatePaymentStatusDto,
    ) {
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

    async updateStatus(
        id: string,
        userId: string,
        updateOrderStatusDto: UpdateOrderStatusDto,
    ) {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const order = await this.prismaService.order.findUnique({
            where: {
                id,
                status: { notIn: [OrderStatus.CANCEL, OrderStatus.RECEIVED] },
            },
        });
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        const isUpdated = await this.prismaService.order.update({
            where: { id },
            data: { status: updateOrderStatusDto.status },
        });

        return {
            is_success: isUpdated ? true : false,
        };
    }

    async calculateShippingFee(
        calculateShippingFeeDto: CalculateShippingFeeDto,
    ) {
        const GHTKShippingFee = await this.GHTKShippingFee(
            calculateShippingFeeDto,
        );

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
        const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
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
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(
                /%20/g,
                '+',
            );
        }
        return sorted;
    }

    private async createGHTKOrder(
        orderId: string,
        orderData: CreateOrderDto,
    ): Promise<GHTKCreateResponse> {
        const products = orderData.order_details.map(async (item) => {
            const productOption =
                await this.prismaService.productOption.findUnique({
                    where: { id: item.product_option_id },
                    select: {
                        sku: true,
                        product: {
                            select: { name: true },
                        },
                        technical_specs: {
                            select: { weight: true },
                        },
                    },
                });

            return {
                name:
                    productOption.product.name +
                    ' ' +
                    productOption.sku.replaceAll('-', ' '),
                weight:
                    Number(
                        productOption.technical_specs.weight.replace(
                            /\D+$/g,
                            '',
                        ),
                    ) / 1000,
                quantity: item.quantity,
            };
        });

        let totalPrice = 0;
        orderData.order_details.forEach(
            (orderDetail) =>
                (totalPrice += orderDetail.price * orderDetail.quantity),
        );

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
            pick_money: totalPrice,
            note: orderData.note,
            value: totalPrice,
            transport: 'road',
            tags: [1, 2],
        };

        const response = await this.httpService.axiosRef({
            method: 'POST',
            url:
                this.configService.get<string>('GHTK_API_URL') +
                '/services/shipment/order',
            data: {
                products: await Promise.all(products),
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
            url: `https://services.giaohangtietkiem.vn/services/shipment/cancel/${label}`,
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
            url: 'https://services.giaohangtietkiem.vn/services/shipment/fee',
            headers: {
                'Content-Type': 'application/json',
                Token: this.configService.get<string>('GHTK_API_TOKEN_KEY'),
            },
            data: {
                pick_province:
                    this.configService.get<string>('GHTK_PICK_PROVINCE'),
                pick_district:
                    this.configService.get<string>('GHTK_PICK_DISTRICT'),
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
            order_details: order.order_details.map((orderDetail) => {
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
                            logo_url:
                                orderDetail.product_option.product.brand
                                    .logo_url,
                        },
                        category: {
                            id: orderDetail.product_option.product.category.id,
                            name: orderDetail.product_option.product.category
                                .name,
                            slug: orderDetail.product_option.product.category
                                .slug,
                        },
                        descriptions:
                            orderDetail.product_option.product.descriptions.map(
                                (el) => ({
                                    id: el.id,
                                    content: el.content,
                                }),
                            ),
                        label: orderDetail.product_option.product.label,
                        price: orderDetail.product_option.product.price,
                        promotions:
                            orderDetail.product_option.product.promotions,
                        warranties:
                            orderDetail.product_option.product.warranties,
                        thumbnail: orderDetail.product_option.thumbnail,
                        options:
                            orderDetail.product_option.product_option_value.map(
                                (el) => ({
                                    name: el.option.name,
                                    value: el.value,
                                    adjust_price: el.adjust_price,
                                }),
                            ),
                        weight: Number(
                            orderDetail.product_option.technical_specs.weight.split(
                                ' ',
                            )[0],
                        ), // 188 g
                        label_image: orderDetail.product_option.label_image,
                        price_modifier:
                            orderDetail.product_option.price_modifier,
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
