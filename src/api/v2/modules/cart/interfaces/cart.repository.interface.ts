import { Cart } from '@prisma/client';

import { ProductCartDB } from '@/prisma/selectors/cart/cart.selector';
import { CreateCartDto } from '@v2/modules/cart/dto';

export interface ICartQueryRepository {
    findUserCart(userId: string, productOptionId: string): Promise<Cart | null>;
    findAllByUserId(userId: string): Promise<ProductCartDB[]>;
}

export interface ICartCommandRepository {
    create(userId: string, createCartDto: CreateCartDto): Promise<ProductCartDB>;
    update(
        cartId: string,
        productOptionId: string,
        data: { quantity: number },
    ): Promise<ProductCartDB>;
    changeProductOption(
        cartId: string,
        oldOptionId: string,
        newOptionId: string,
    ): Promise<ProductCartDB>;
    delete(cartId: string): Promise<boolean>;
}

export interface ICartRepository extends ICartQueryRepository, ICartCommandRepository {}
