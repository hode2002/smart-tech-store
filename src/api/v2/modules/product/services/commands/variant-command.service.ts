import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { ProductVariant } from '@/prisma/selectors';
import { CacheService } from '@v2/modules/cache/cache.service';
import { PRODUCT_TOKENS } from '@v2/modules/product/constants';
import { CreateVariantDto, UpdateVariantDto } from '@v2/modules/product/dtos';
import {
    IVariantCommandRepository,
    IVariantCommandService,
    IVariantQueryRepository,
} from '@v2/modules/product/interfaces';

@Injectable()
export class VariantCommandService implements IVariantCommandService {
    constructor(
        @Inject(PRODUCT_TOKENS.REPOSITORIES.VARIANT_COMMAND)
        private readonly commandRepository: IVariantCommandRepository,
        @Inject(PRODUCT_TOKENS.REPOSITORIES.VARIANT_QUERY)
        private readonly variantQueryRepository: IVariantQueryRepository,
        private readonly cacheService: CacheService,
    ) {}

    async create(productId: string, createVariantDto: CreateVariantDto): Promise<ProductVariant> {
        const [variant] = await Promise.all([
            this.commandRepository.create(productId, createVariantDto),
            this.invalidateProductOptionCache(productId),
        ]);

        return variant;
    }

    async update(variantId: string, updateVariantDto: UpdateVariantDto): Promise<ProductVariant> {
        const variant = await this.variantQueryRepository.findById(variantId);
        if (!variant) {
            throw new NotFoundException(`Product variant with ID ${variantId} not found`);
        }

        const [updatedVariant] = await Promise.all([
            this.commandRepository.update(variantId, updateVariantDto),
            this.invalidateProductOptionCache(variant.product.id),
        ]);

        return updatedVariant;
    }

    async softDelete(variantId: string): Promise<boolean> {
        const variant = await this.variantQueryRepository.findById(variantId);

        if (!variant) {
            throw new NotFoundException(`Product variant with ID ${variantId} not found`);
        }

        const [result] = await Promise.all([
            this.commandRepository.softDelete(variantId),
            this.invalidateProductOptionCache(variant.product.id),
        ]);

        return result;
    }

    async restore(id: string): Promise<boolean> {
        const variant = await this.variantQueryRepository.findById(id);

        if (!variant) {
            throw new NotFoundException(`Product option with ID ${id} not found`);
        }

        const [result] = await Promise.all([
            this.commandRepository.restore(id),
            this.invalidateProductOptionCache(variant.product.id),
        ]);

        return result;
    }

    private async invalidateProductOptionCache(productId: string): Promise<void> {
        await Promise.all([
            this.cacheService.del(`product_${productId}`),
            this.cacheService.del(`product_management_${productId}`),
            this.cacheService.deleteByPattern(`product_slug_*`),
            this.cacheService.deleteByPattern(`products_*`),
            this.cacheService.deleteByPattern(`product_option_*`),
        ]);
    }
}
