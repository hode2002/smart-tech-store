import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';

import { Pagination } from '@/common/types';
import { CacheService } from '@v2/modules/cache/cache.service';
import { PRODUCT_TOKENS } from '@v2/modules/product/constants';
import { ResponseProductDto } from '@v2/modules/product/dtos';
import { IProductQueryRepository, IProductQueryService } from '@v2/modules/product/interfaces';

@Injectable()
export class ProductQueryService implements IProductQueryService {
    constructor(
        @Inject(PRODUCT_TOKENS.REPOSITORIES.PRODUCT_QUERY)
        private readonly queryRepository: IProductQueryRepository,
        private readonly cacheService: CacheService,
    ) {}

    async findAll(request: Request): Promise<Pagination<ResponseProductDto>> {
        const cacheKey = `products_${JSON.stringify(request.query)}`;
        const cachedData = await this.cacheService.get<Pagination<ResponseProductDto>>(cacheKey);

        if (cachedData) {
            return cachedData;
        }

        const { products, meta } = await this.queryRepository.findAll(request);
        const productsData = {
            products: products.map(product => plainToInstance(ResponseProductDto, product)),
            meta,
        } as unknown as Pagination<ResponseProductDto>;

        await this.cacheService.set(cacheKey, productsData);

        return productsData;
    }

    async findAllManagement(request: Request): Promise<Pagination<ResponseProductDto>> {
        const cacheKey = `products_management_${JSON.stringify(request.query)}`;
        const cachedData = await this.cacheService.get<Pagination<ResponseProductDto>>(cacheKey);

        if (cachedData) {
            return cachedData;
        }

        const { products, meta } = await this.queryRepository.findAllManagement(request);
        const productsData = {
            products: products.map(product => plainToInstance(ResponseProductDto, product)),
            meta,
        } as unknown as Pagination<ResponseProductDto>;

        await this.cacheService.set(cacheKey, productsData);

        return productsData;
    }

    async findById(id: string): Promise<ResponseProductDto> {
        const cacheKey = `product_${id}`;
        const cachedData = await this.cacheService.get<ResponseProductDto>(cacheKey);

        if (cachedData) {
            return cachedData;
        }

        const product = await this.queryRepository.findById(id);

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        const response = plainToInstance(ResponseProductDto, product);
        await this.cacheService.set(cacheKey, response);

        return response;
    }

    async findByVariantId(variantId: string): Promise<ResponseProductDto> {
        const cacheKey = `product_variant_${variantId}`;
        const cachedData = await this.cacheService.get<ResponseProductDto>(cacheKey);

        if (cachedData) {
            return cachedData;
        }

        const product = await this.queryRepository.findByVariantId(variantId);
        if (!product) {
            throw new NotFoundException(`Product with ID ${product.id} not found`);
        }

        const response = plainToInstance(ResponseProductDto, product);
        await this.cacheService.set(cacheKey, response);

        return response;
    }

    async findBySlug(slug: string): Promise<ResponseProductDto> {
        const cacheKey = `product_slug_${slug}`;
        const cachedData = await this.cacheService.get<ResponseProductDto>(cacheKey);

        if (cachedData) {
            return cachedData;
        }

        const product = await this.queryRepository.findBySlug(slug);
        if (!product) {
            throw new NotFoundException(`Product with slug ${slug} not found`);
        }

        const response = plainToInstance(ResponseProductDto, product);
        await this.cacheService.set(cacheKey, response);

        return response;
    }
}
