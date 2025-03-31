import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import {
    CartProductOptionResponse,
    ProductCartDB,
    ProductCartResponse,
} from '@/prisma/selectors/cart/cart.selector';
import { CacheService } from '@v2/modules/cache/cache.service';
import { CART_TOKENS } from '@v2/modules/cart/constants';
import { ICartQueryRepository } from '@v2/modules/cart/interfaces';
import { ICartQueryService } from '@v2/modules/cart/interfaces/cart.service.interface';
import { USER_TOKENS } from '@v2/modules/user/constants';
import { IUserQueryService } from '@v2/modules/user/interfaces';

@Injectable()
export class CartQueryService implements ICartQueryService {
    constructor(
        @Inject(CART_TOKENS.REPOSITORIES.QUERY)
        private readonly queryRepository: ICartQueryRepository,
        @Inject(USER_TOKENS.SERVICES.USER_QUERY_SERVICE)
        private readonly UserQueryService: IUserQueryService,
        private readonly cacheService: CacheService,
    ) {}

    async findUserCart(userId: string, productOptionId: string) {
        const cacheKey = `cart_user_${userId}_product_${productOptionId}`;
        const cacheData = await this.cacheService.get(cacheKey);
        if (cacheData) {
            return cacheData;
        }

        const cart = await this.queryRepository.findUserCart(userId, productOptionId);
        if (cart) {
            await this.cacheService.set(cacheKey, cart);
        }
        return cart;
    }

    async findProductsByUserId(userId: string): Promise<ProductCartResponse[]> {
        const cacheKey = `cart_products_user_${userId}`;
        const cacheData = await this.cacheService.get<ProductCartResponse[]>(cacheKey);
        if (cacheData) {
            return cacheData;
        }

        const user = await this.UserQueryService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const products = await this.queryRepository.findAllByUserId(userId);
        const result = products.map(product => this.convertResponse(product));

        await this.cacheService.set(cacheKey, result);
        return result;
    }

    private convertOptionResponse(productOption: CartProductOptionResponse) {
        return {
            id: productOption.id,
            price_modifier: productOption.price_modifier,
            label_image: productOption.label_image,
            is_sale: productOption.is_sale,
            discount: productOption.discount,
            options: productOption.product_option_value.map(el => ({
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
                productOption?.technical_specs?.specs?.[0]?.value?.split('g')[0]?.trim() || 0,
            ),
        };
    }

    public convertResponse(productCartDB: ProductCartDB): ProductCartResponse {
        const selectedOption = productCartDB.product_option;
        return {
            id: selectedOption.product.id,
            name: selectedOption.product.name,
            price: selectedOption.product.price,
            brand: selectedOption.product.brand,
            category: selectedOption.product.category,
            warranties: selectedOption.product.warranties,
            selected_option: this.convertOptionResponse(selectedOption),
            other_product_options: selectedOption.product.product_options
                .filter(productOption => productOption.id !== selectedOption.id)
                .map(this.convertOptionResponse),
            quantity: productCartDB.quantity,
        };
    }
}
