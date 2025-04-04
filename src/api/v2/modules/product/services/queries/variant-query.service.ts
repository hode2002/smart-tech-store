import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { ProductVariant } from '@/prisma/selectors';
import { CacheService } from '@v2/modules/cache/cache.service';
import { PRODUCT_TOKENS } from '@v2/modules/product/constants';
import { IVariantQueryRepository, IVariantQueryService } from '@v2/modules/product/interfaces';

@Injectable()
export class VariantQueryService implements IVariantQueryService {
    constructor(
        @Inject(PRODUCT_TOKENS.REPOSITORIES.VARIANT_QUERY)
        private readonly queryRepository: IVariantQueryRepository,
        private readonly cacheService: CacheService,
    ) {}

    async findByProductId(productId: string): Promise<ProductVariant[]> {
        const cacheKey = `product_option_${productId}`;
        const cachedData = await this.cacheService.get<ProductVariant[]>(cacheKey);

        if (cachedData) {
            return cachedData;
        }

        const productOptions = await this.queryRepository.findByProductId(productId);

        if (productOptions && productOptions.length > 0) {
            await this.cacheService.set(cacheKey, productOptions);
        }

        return productOptions;
    }

    async findById(id: string): Promise<ProductVariant> {
        const cacheKey = `product_option_detail_${id}`;
        const cachedData = await this.cacheService.get<ProductVariant>(cacheKey);

        if (cachedData) {
            return cachedData;
        }

        const productOption = await this.queryRepository.findById(id);

        if (!productOption) {
            throw new NotFoundException(`Product option with ID ${id} not found`);
        }

        await this.cacheService.set(cacheKey, productOption);
        return productOption;
    }
}
