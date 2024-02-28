import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto, DeleteCartDto, UpdateCartDto } from './dto';
import { PrismaService } from './../prisma/prisma.service';
import { UserService } from './../user/user.service';
import { ProductCartDB, ProductCartResponse } from './types';

@Injectable()
export class CartService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly userService: UserService,
    ) {}

    async addProductToCart(userId: string, createCartDto: CreateCartDto) {
        const { productOptionId, quantity } = createCartDto;

        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const userCart = await this.prismaService.cart.findUnique({
            where: { user_id: userId, product_option_id: productOptionId },
        });

        if (!userCart) {
            return await this.prismaService.cart.create({
                data: {
                    user_id: userId,
                    product_option_id: productOptionId,
                    quantity,
                },
                select: {
                    product_option: {
                        select: {
                            product: {
                                select: {
                                    name: true,
                                },
                            },
                            product_option_value: {
                                select: {
                                    option: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                    value: true,
                                },
                            },
                        },
                    },
                    quantity: true,
                },
            });
        }

        const isUpdated = await this.prismaService.cart.update({
            where: { id: userCart.id, product_option_id: productOptionId },
            data: {
                quantity: userCart.quantity + quantity,
            },
            select: {
                product_option: {
                    select: {
                        product: {
                            select: {
                                name: true,
                            },
                        },
                        product_option_value: {
                            select: {
                                option: {
                                    select: {
                                        name: true,
                                    },
                                },
                                value: true,
                            },
                        },
                    },
                },
                quantity: true,
            },
        });

        return isUpdated;
    }

    async findProductsByUserId(userId: string) {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const products = await this.prismaService.cart.findMany({
            where: { user_id: userId },
            select: {
                product_option: {
                    select: {
                        id: true,
                        is_sale: true,
                        price_modifier: true,
                        stock: true,
                        thumbnail: true,
                        sku: true,
                        slug: true,
                        discount: true,
                        label_image: true,
                        product_images: {
                            select: {
                                id: true,
                                image_url: true,
                                image_alt_text: true,
                            },
                        },
                        product: {
                            select: {
                                name: true,
                                price: true,
                                brand: {
                                    select: {
                                        id: true,
                                        name: true,
                                        logo_url: true,
                                        slug: true,
                                    },
                                },
                                category: {
                                    select: {
                                        id: true,
                                        name: true,
                                        slug: true,
                                    },
                                },
                                warranties: true,
                            },
                        },
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
                    },
                },
                quantity: true,
            },
        });

        return this.flatData(products);
    }

    async updateProductQuantity(userId: string, updateCartDto: UpdateCartDto) {
        const { productOptionId, quantity } = updateCartDto;

        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const userCart = await this.prismaService.cart.findUnique({
            where: { user_id: userId },
        });

        const isUpdated = await this.prismaService.cart.update({
            where: { id: userCart.id, product_option_id: productOptionId },
            data: {
                quantity,
            },
            select: {
                product_option: {
                    select: {
                        product: {
                            select: {
                                name: true,
                                price: true,
                                brand: {
                                    select: {
                                        id: true,
                                        name: true,
                                        logo_url: true,
                                        slug: true,
                                    },
                                },
                                category: {
                                    select: {
                                        id: true,
                                        name: true,
                                        slug: true,
                                    },
                                },
                                warranties: true,
                            },
                        },
                        product_option_value: {
                            select: {
                                option: {
                                    select: {
                                        name: true,
                                    },
                                },
                                value: true,
                            },
                        },
                    },
                },
                quantity: true,
            },
        });

        return isUpdated;
    }

    async deleteProduct(userId: string, deleteCartDto: DeleteCartDto) {
        const { productOptionId } = deleteCartDto;
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isDeleted = await this.prismaService.cart.delete({
            where: { user_id: userId, product_option_id: productOptionId },
        });

        return {
            is_success: isDeleted ? 'true' : 'false',
        };
    }

    private flatData = (
        productCartDB: ProductCartDB[],
    ): ProductCartResponse[] => {
        return productCartDB.map((item) => ({
            id: item.product_option.id,
            name: item.product_option.product.name,
            product_images: item.product_option.product_images,
            is_sale: item.product_option.is_sale,
            price:
                item.product_option.product.price +
                item.product_option.price_modifier,
            brand: item.product_option.product.brand,
            category: item.product_option.product.category,
            stock: item.product_option.stock,
            thumbnail: item.product_option.thumbnail,
            sku: item.product_option.sku,
            slug: item.product_option.slug,
            discount: item.product_option.discount,
            label_image: item.product_option.label_image,
            options: item.product_option.product_option_value.map((el) => ({
                name: el.option.name,
                value: el.value,
                adjust_price: el.adjust_price,
            })),
            warranties: item.product_option.product.warranties,
            quantity: item.quantity,
        }));
    };
}
