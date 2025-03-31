import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { ProductCartResponse } from '@/prisma/selectors/cart/cart.selector';
import { CacheService } from '@v2/modules/cache/cache.service';
import { CART_TOKENS } from '@v2/modules/cart/constants';
import {
    CreateCartDto,
    UpdateCartDto,
    ChangeProductOptionDto,
    DeleteCartDto,
} from '@v2/modules/cart/dto';
import { ICartCommandRepository, ICartQueryService } from '@v2/modules/cart/interfaces';
import { ICartCommandService } from '@v2/modules/cart/interfaces/cart.service.interface';
import { USER_TOKENS } from '@v2/modules/user/constants';
import { IUserQueryService } from '@v2/modules/user/interfaces';

@Injectable()
export class CartCommandService implements ICartCommandService {
    constructor(
        @Inject(CART_TOKENS.REPOSITORIES.COMMAND)
        private readonly commandRepository: ICartCommandRepository,
        @Inject(CART_TOKENS.SERVICES.QUERY)
        private readonly cartQueryService: ICartQueryService,
        @Inject(USER_TOKENS.SERVICES.USER_QUERY_SERVICE)
        private readonly userQueryService: IUserQueryService,
        private readonly prismaService: PrismaService,
        private readonly cacheService: CacheService,
    ) {}

    async addProductToCart(
        userId: string,
        createCartDto: CreateCartDto,
    ): Promise<ProductCartResponse> {
        const { productOptionId, quantity } = createCartDto;

        const user = await this.userQueryService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const userCart = await this.cartQueryService.findUserCart(userId, productOptionId);

        let cartItem;
        if (!userCart) {
            cartItem = await this.commandRepository.create(userId, createCartDto);
        } else {
            cartItem = await this.commandRepository.update(userCart.id, productOptionId, {
                quantity: userCart.quantity + quantity,
            });
        }

        await Promise.all([
            this.cacheService.del(`cart_user_${userId}_product_${productOptionId}`),
            this.cacheService.del(`cart_products_user_${userId}`),
        ]);

        return this.cartQueryService.convertResponse(cartItem);
    }

    async changeProductOption(
        userId: string,
        changeProductOptionDto: ChangeProductOptionDto,
    ): Promise<ProductCartResponse> {
        const { oldOptionId, newOptionId } = changeProductOptionDto;

        const user = await this.userQueryService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const userCart = await this.cartQueryService.findUserCart(userId, oldOptionId);
        if (!userCart) {
            throw new NotFoundException('Product does not exist in cart');
        }

        const productOption = await this.prismaService.productOption.findFirst({
            where: { id: newOptionId },
        });

        if (!productOption) {
            throw new NotFoundException('Product not found');
        }

        const cartItem = await this.commandRepository.changeProductOption(
            userCart.id,
            oldOptionId,
            newOptionId,
        );

        await Promise.all([
            this.cacheService.del(`cart_user_${userId}_product_${oldOptionId}`),
            this.cacheService.del(`cart_user_${userId}_product_${newOptionId}`),
            this.cacheService.del(`cart_products_user_${userId}`),
        ]);

        return this.cartQueryService.convertResponse(cartItem);
    }

    async updateProductQuantity(
        userId: string,
        updateCartDto: UpdateCartDto,
    ): Promise<ProductCartResponse> {
        const { productOptionId, quantity } = updateCartDto;

        const user = await this.userQueryService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const userCart = await this.cartQueryService.findUserCart(userId, productOptionId);
        if (!userCart) {
            throw new NotFoundException('Product does not exist in cart');
        }

        const productOption = await this.prismaService.productOption.findFirst({
            where: { id: productOptionId },
        });

        if (!productOption) {
            throw new NotFoundException('Product not found');
        }

        const cartItemUpdated = await this.commandRepository.update(userCart.id, productOptionId, {
            quantity,
        });

        await Promise.all([
            this.cacheService.del(`cart_user_${userId}_product_${productOptionId}`),
            this.cacheService.del(`cart_products_user_${userId}`),
        ]);

        return this.cartQueryService.convertResponse(cartItemUpdated);
    }

    async deleteProduct(
        userId: string,
        deleteCartDto: DeleteCartDto,
    ): Promise<{ is_success: boolean }> {
        const { productOptionId } = deleteCartDto;

        const user = await this.userQueryService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const userCart = await this.cartQueryService.findUserCart(userId, productOptionId);
        if (!userCart) {
            throw new NotFoundException('Product does not exist in cart');
        }

        const productOption = await this.prismaService.productOption.findFirst({
            where: { id: productOptionId },
        });

        if (!productOption) {
            throw new NotFoundException('Product not found');
        }

        const isDeleted = await this.commandRepository.delete(userCart.id);

        await Promise.all([
            this.cacheService.del(`cart_user_${userId}_product_${productOptionId}`),
            this.cacheService.del(`cart_products_user_${userId}`),
        ]);

        return {
            is_success: isDeleted,
        };
    }
}
