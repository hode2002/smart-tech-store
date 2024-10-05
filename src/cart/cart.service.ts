import { Injectable, NotFoundException } from '@nestjs/common';
import {
    ChangeProductOptionDto,
    CreateCartDto,
    DeleteCartDto,
    UpdateCartDto,
} from './dto';
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

        const userCart = await this.prismaService.cart.findFirst({
            where: { user_id: userId, product_option_id: productOptionId },
        });

        if (!userCart) {
            const cartItem: ProductCartDB =
                await this.prismaService.cart.create({
                    data: {
                        user_id: userId,
                        product_option_id: productOptionId,
                        quantity,
                    },
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
                                technical_specs: {
                                    select: {
                                        specs: {
                                            where: { key: 'Khối lượng' },
                                            select: {
                                                value: true,
                                            },
                                        },
                                    },
                                },
                                product_images: {
                                    select: {
                                        id: true,
                                        image_url: true,
                                        image_alt_text: true,
                                    },
                                },
                                product: {
                                    select: {
                                        id: true,
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
                                        product_options: {
                                            where: {
                                                cart: {
                                                    none: { user_id: userId },
                                                },
                                            },
                                            select: {
                                                id: true,
                                                price_modifier: true,
                                                label_image: true,
                                                is_sale: true,
                                                discount: true,
                                                technical_specs: {
                                                    select: {
                                                        specs: {
                                                            where: {
                                                                key: 'Khối lượng',
                                                            },
                                                            select: {
                                                                key: true,
                                                                value: true,
                                                            },
                                                        },
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
                                                product_images: {
                                                    select: {
                                                        id: true,
                                                        image_url: true,
                                                        image_alt_text: true,
                                                    },
                                                },
                                                slug: true,
                                                sku: true,
                                                stock: true,
                                                thumbnail: true,
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
            return this.convertResponse(cartItem);
        }

        const cartItem: ProductCartDB = await this.prismaService.cart.update({
            where: { id: userCart.id, product_option_id: productOptionId },
            data: {
                quantity: userCart.quantity + quantity,
            },
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
                        technical_specs: {
                            select: {
                                specs: {
                                    where: {
                                        key: 'Khối lượng',
                                    },
                                    select: {
                                        key: true,
                                        value: true,
                                    },
                                },
                            },
                        },
                        product_images: {
                            select: {
                                id: true,
                                image_url: true,
                                image_alt_text: true,
                            },
                        },
                        product: {
                            select: {
                                id: true,
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
                                product_options: {
                                    where: {
                                        cart: {
                                            none: { user_id: userId },
                                        },
                                    },
                                    select: {
                                        id: true,
                                        price_modifier: true,
                                        label_image: true,
                                        is_sale: true,
                                        discount: true,
                                        technical_specs: {
                                            select: {
                                                specs: {
                                                    where: {
                                                        key: 'Khối lượng',
                                                    },
                                                    select: {
                                                        key: true,
                                                        value: true,
                                                    },
                                                },
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
                                        product_images: {
                                            select: {
                                                id: true,
                                                image_url: true,
                                                image_alt_text: true,
                                            },
                                        },
                                        slug: true,
                                        sku: true,
                                        stock: true,
                                        thumbnail: true,
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
        return this.convertResponse(cartItem);
    }

    async changeProductOption(
        userId: string,
        changeProductOptionDto: ChangeProductOptionDto,
    ) {
        const { oldOptionId, newOptionId } = changeProductOptionDto;

        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const userCart = await this.prismaService.cart.findFirst({
            where: {
                user_id: userId,
                product_option_id: oldOptionId,
            },
        });

        if (!userCart) {
            throw new NotFoundException('Product does not exist in cart');
        }

        const productOption = await this.prismaService.productOption.findFirst({
            where: { id: newOptionId },
        });

        if (!productOption) {
            throw new NotFoundException('Product not found');
        }

        const cartItem: ProductCartDB = await this.prismaService.cart.update({
            where: {
                id: userCart.id,
                product_option_id: oldOptionId,
            },
            data: {
                product_option_id: newOptionId,
            },
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
                        technical_specs: {
                            select: {
                                specs: {
                                    where: {
                                        key: 'Khối lượng',
                                    },
                                    select: {
                                        key: true,
                                        value: true,
                                    },
                                },
                            },
                        },
                        product_images: {
                            select: {
                                id: true,
                                image_url: true,
                                image_alt_text: true,
                            },
                        },
                        product: {
                            select: {
                                id: true,
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
                                product_options: {
                                    where: {
                                        cart: {
                                            none: { user_id: userId },
                                        },
                                    },
                                    select: {
                                        id: true,
                                        price_modifier: true,
                                        label_image: true,
                                        is_sale: true,
                                        discount: true,
                                        technical_specs: {
                                            select: {
                                                specs: {
                                                    where: {
                                                        key: 'Khối lượng',
                                                    },
                                                    select: {
                                                        key: true,
                                                        value: true,
                                                    },
                                                },
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
                                        product_images: {
                                            select: {
                                                id: true,
                                                image_url: true,
                                                image_alt_text: true,
                                            },
                                        },
                                        slug: true,
                                        sku: true,
                                        stock: true,
                                        thumbnail: true,
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
        return this.convertResponse(cartItem);
    }

    async findProductsByUserId(userId: string) {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const products: ProductCartDB[] =
            await this.prismaService.cart.findMany({
                where: { user_id: userId },
                orderBy: { created_at: 'asc' },
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
                            technical_specs: {
                                select: {
                                    specs: {
                                        where: {
                                            key: 'Khối lượng',
                                        },
                                        select: {
                                            key: true,
                                            value: true,
                                        },
                                    },
                                },
                            },
                            product_images: {
                                select: {
                                    id: true,
                                    image_url: true,
                                    image_alt_text: true,
                                },
                            },
                            product: {
                                select: {
                                    id: true,
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
                                    product_options: {
                                        where: {
                                            cart: {
                                                none: { user_id: userId },
                                            },
                                        },
                                        select: {
                                            id: true,
                                            price_modifier: true,
                                            label_image: true,
                                            is_sale: true,
                                            discount: true,
                                            technical_specs: {
                                                select: {
                                                    specs: {
                                                        where: {
                                                            key: 'Khối lượng',
                                                        },
                                                        select: {
                                                            key: true,
                                                            value: true,
                                                        },
                                                    },
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
                                            product_images: {
                                                select: {
                                                    id: true,
                                                    image_url: true,
                                                    image_alt_text: true,
                                                },
                                            },
                                            slug: true,
                                            sku: true,
                                            stock: true,
                                            thumbnail: true,
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

        return products.map((product) => this.convertResponse(product));
    }

    async updateProductQuantity(userId: string, updateCartDto: UpdateCartDto) {
        const { productOptionId, quantity } = updateCartDto;

        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const userCart = await this.prismaService.cart.findFirst({
            where: {
                user_id: userId,
                product_option_id: productOptionId,
            },
        });

        if (!userCart) {
            throw new NotFoundException('Product does not exist in cart');
        }

        const productOption = await this.prismaService.productOption.findFirst({
            where: { id: productOptionId },
        });

        if (!productOption) {
            throw new NotFoundException('Product not found');
        }

        const cartItemUpdated: ProductCartDB =
            await this.prismaService.cart.update({
                where: {
                    id: userCart.id,
                    product_option_id: productOptionId,
                },
                data: {
                    quantity,
                },
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
                            technical_specs: {
                                select: {
                                    specs: {
                                        where: {
                                            key: 'Khối lượng',
                                        },
                                        select: {
                                            key: true,
                                            value: true,
                                        },
                                    },
                                },
                            },
                            product_images: {
                                select: {
                                    id: true,
                                    image_url: true,
                                    image_alt_text: true,
                                },
                            },
                            product: {
                                select: {
                                    id: true,
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
                                    product_options: {
                                        where: {
                                            cart: {
                                                none: { user_id: userId },
                                            },
                                        },
                                        select: {
                                            id: true,
                                            price_modifier: true,
                                            label_image: true,
                                            is_sale: true,
                                            discount: true,
                                            technical_specs: {
                                                select: {
                                                    specs: {
                                                        where: {
                                                            key: 'Khối lượng',
                                                        },
                                                        select: {
                                                            key: true,
                                                            value: true,
                                                        },
                                                    },
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
                                            product_images: {
                                                select: {
                                                    id: true,
                                                    image_url: true,
                                                    image_alt_text: true,
                                                },
                                            },
                                            slug: true,
                                            sku: true,
                                            stock: true,
                                            thumbnail: true,
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

        return this.convertResponse(cartItemUpdated);
    }

    async deleteProduct(userId: string, deleteCartDto: DeleteCartDto) {
        const { productOptionId } = deleteCartDto;
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const userCart = await this.prismaService.cart.findFirst({
            where: {
                user_id: userId,
                product_option_id: productOptionId,
            },
        });

        if (!userCart) {
            throw new NotFoundException('Product does not exist in cart');
        }

        const productOption = await this.prismaService.productOption.findFirst({
            where: { id: productOptionId },
        });

        if (!productOption) {
            throw new NotFoundException('Product not found');
        }

        const isDeleted = await this.prismaService.cart.delete({
            where: {
                id: userCart.id,
            },
        });

        return {
            is_success: isDeleted ? true : false,
        };
    }

    private convertResponse = (
        productCartDB: ProductCartDB,
    ): ProductCartResponse => {
        const selectedOption = productCartDB.product_option;
        return {
            id: selectedOption.product.id,
            name: selectedOption.product.name,
            price: selectedOption.product.price,
            brand: selectedOption.product.brand,
            category: selectedOption.product.category,
            warranties: selectedOption.product.warranties,
            selected_option: {
                id: selectedOption.id,
                price_modifier: selectedOption.price_modifier,
                label_image: selectedOption.label_image,
                is_sale: selectedOption.is_sale,
                discount: selectedOption.discount,
                options: selectedOption.product_option_value.map((el) => ({
                    name: el.option.name,
                    value: el.value,
                    adjust_price: el.adjust_price,
                })),
                product_images: selectedOption.product_images,
                slug: selectedOption.slug,
                sku: selectedOption.sku,
                stock: selectedOption.stock,
                thumbnail: selectedOption.thumbnail,
                weight: Number(
                    selectedOption.technical_specs.specs[0].value?.split(
                        'g',
                    )[0], // 188g
                ),
            },
            other_product_options: selectedOption.product.product_options
                .filter(
                    (productOption) => productOption.id !== selectedOption.id,
                )
                .map((productOption) => ({
                    id: productOption.id,
                    price_modifier: productOption.price_modifier,
                    label_image: productOption.label_image,
                    is_sale: productOption.is_sale,
                    discount: productOption.discount,
                    options: productOption.product_option_value.map((el) => ({
                        name: el.option.name,
                        value: el.value,
                        adjust_price: el.adjust_price,
                    })),
                    product_images: productOption.product_images,
                    slug: productOption.slug,
                    sku: productOption.sku,
                    stock: productOption.stock,
                    thumbnail: productOption.thumbnail,
                    weight: Number(
                        selectedOption.technical_specs.specs[0].value?.split(
                            ' g',
                        )[0], // 188g
                    ),
                })),

            quantity: productCartDB.quantity,
        };
    };
}
