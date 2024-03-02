import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
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
import { CalculateShippingFeeDto, UpdateOrderStatusDto } from './dto';

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
                throw new InternalServerErrorException('Internal server error');
            }

            let totalOrderPrice = 0;

            const orderDetailPromises = order_details.map(
                async (orderDetail) => {
                    totalOrderPrice += orderDetail.quantity * orderDetail.price;
                    return prisma.orderDetail.create({
                        data: {
                            order_id: order.id,
                            product_option_id: orderDetail.product_option_id,
                            price: orderDetail.price,
                            quantity: orderDetail.quantity,
                            subtotal: orderDetail.quantity * orderDetail.price,
                        },
                    });
                },
            );

            const GHTKOrder = await this.createGHTKOrder(
                order.id,
                createOrderDto,
            );
            if (!GHTKOrder?.success) {
                throw new InternalServerErrorException('Internal server error');
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

        const orders = <OrderDBResponse[]>(
            await this.prismaService.order.findMany({
                where: {
                    user_id: user.id,
                    status: status,
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
            })
        );

        return orders.map((order) => this.convertOrderResponse(order));
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
            url: 'https://services.giaohangtietkiem.vn/services/shipment/order',
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
