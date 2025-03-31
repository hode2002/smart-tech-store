import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { CART_ITEM_SELECT, ProductCartDB } from '@/prisma/selectors/cart/cart.selector';
import { ICartQueryRepository } from '@v2/modules/cart/interfaces';

@Injectable()
export class CartQueryRepository implements ICartQueryRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findUserCart(userId: string, productOptionId: string) {
        return this.prisma.cart.findFirst({
            where: {
                user_id: userId,
                product_option_id: productOptionId,
            },
        });
    }

    async findAllByUserId(userId: string): Promise<ProductCartDB[]> {
        return this.prisma.cart.findMany({
            where: { user_id: userId },
            orderBy: { created_at: 'asc' },
            select: CART_ITEM_SELECT,
        });
    }
}
