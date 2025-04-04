import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { ProductBasic, ProductWithVariant } from '@/prisma/selectors';
import { CacheService } from '@v2/modules/cache/cache.service';
import { PRODUCT_TOKENS } from '@v2/modules/product/constants';
import { CreateProductDto, UpdateProductDto } from '@v2/modules/product/dtos';
import {
    IProductCommandRepository,
    IProductCommandService,
    IProductQueryRepository,
    IVariantCommandService,
} from '@v2/modules/product/interfaces';

@Injectable()
export class ProductCommandService implements IProductCommandService {
    constructor(
        @Inject(PRODUCT_TOKENS.REPOSITORIES.PRODUCT_COMMAND)
        private readonly commandRepository: IProductCommandRepository,
        @Inject(PRODUCT_TOKENS.REPOSITORIES.PRODUCT_QUERY)
        private readonly queryRepository: IProductQueryRepository,
        @Inject(PRODUCT_TOKENS.SERVICES.VARIANT_COMMAND)
        private readonly variantCommandService: IVariantCommandService,
        private readonly cacheService: CacheService,
    ) {}

    async create(createProductDto: CreateProductDto): Promise<ProductWithVariant> {
        const [product] = await Promise.all([
            this.commandRepository.create(createProductDto),
            this.invalidateProductCache(),
        ]);
        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductBasic> {
        const existingProduct = await this.queryRepository.findById(id);
        if (!existingProduct) {
            throw new BadRequestException(`Product with ID ${id} not found`);
        }

        const [updatedProduct] = await Promise.all([
            this.commandRepository.update(id, updateProductDto),
            this.invalidateProductCache(id),
        ]);

        return updatedProduct;
    }

    async softDelete(id: string): Promise<boolean> {
        const [deletedProduct] = await Promise.all([
            this.commandRepository.softDelete(id),
            this.invalidateProductCache(id),
        ]);
        return deletedProduct;
    }

    async restore(id: string): Promise<boolean> {
        const [restoredProduct] = await Promise.all([
            this.commandRepository.restore(id),
            this.invalidateProductCache(id),
        ]);
        return restoredProduct;
    }

    private async invalidateProductCache(productId?: string): Promise<void> {
        if (productId) {
            await Promise.all([
                this.cacheService.del(`product_${productId}`),
                this.cacheService.del(`product_management_${productId}`),
            ]);
        }

        await this.cacheService.deleteByPattern('products_*');
    }
}
