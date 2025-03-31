import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { CART_ITEM_SELECT, ProductCartDB } from '@/prisma/selectors/cart/cart.selector';
import { CreateCartDto } from '@v2/modules/cart/dto';
import { ICartCommandRepository } from '@v2/modules/cart/interfaces';

@Injectable()
export class CartCommandRepository implements ICartCommandRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(userId: string, createCartDto: CreateCartDto): Promise<ProductCartDB> {
        const { productOptionId, quantity } = createCartDto;

        return this.prisma.cart.create({
            data: {
                user_id: userId,
                product_option_id: productOptionId,
                quantity,
            },
            select: CART_ITEM_SELECT,
        });
    }

    async update(
        cartId: string,
        productOptionId: string,
        data: { quantity: number },
    ): Promise<ProductCartDB> {
        const cart = await this.prisma.cart.findUnique({
            where: { id: cartId },
            select: { user_id: true },
        });

        return this.prisma.cart.update({
            where: {
                id: cartId,
                product_option_id: productOptionId,
                user_id: cart.user_id,
            },
            data,
            select: CART_ITEM_SELECT,
        });
    }

    async changeProductOption(
        cartId: string,
        oldOptionId: string,
        newOptionId: string,
    ): Promise<ProductCartDB> {
        const cart = await this.prisma.cart.findUnique({
            where: { id: cartId },
            select: { user_id: true },
        });

        return this.prisma.cart.update({
            where: {
                id: cartId,
                product_option_id: oldOptionId,
                user_id: cart.user_id,
            },
            data: {
                product_option_id: newOptionId,
            },
            select: CART_ITEM_SELECT,
        });
    }

    async delete(cartId: string): Promise<boolean> {
        await this.prisma.cart.delete({
            where: { id: cartId },
        });

        return true;
    }
}
