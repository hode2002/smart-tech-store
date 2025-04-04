import { Injectable } from '@nestjs/common';
import { VariantStatus } from '@prisma/client';
import { Request } from 'express';

import { formatPagination } from '@/common/helpers';
import { Pagination } from '@/common/types';
import { PrismaService } from '@/prisma/prisma.service';
import { PRODUCT_DETAIL_SELECT, ProductDetail } from '@/prisma/selectors';
import { IProductQueryRepository } from '@v2/modules/product/interfaces';
import { ProductWhereInput } from '@v2/modules/product/types';

@Injectable()
export class ProductQueryRepository implements IProductQueryRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(request: Request): Promise<Pagination<ProductDetail>> {
        const { page = 1, limit = 10 } = request.query;

        const query = this.queryBuilder(request);
        const where: ProductWhereInput = {
            ...query,
            variants: {
                some: {
                    deleted_at: null,
                    status: VariantStatus.ACTIVE,
                    stock_quantity: {
                        gte: 1,
                    },
                },
            },
        };

        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);

        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take,
                select: PRODUCT_DETAIL_SELECT,
            }),
            this.prisma.product.count({ where }),
        ]);

        return formatPagination({ products }, total, Number(page), Number(limit));
    }

    async findAllManagement(request: Request): Promise<Pagination<ProductDetail>> {
        const { page = 1, limit = 10 } = request.query;

        const where = this.queryBuilder(request);
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);

        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take,
                select: PRODUCT_DETAIL_SELECT,
            }),
            this.prisma.product.count({ where }),
        ]);

        return formatPagination({ products }, total, Number(page), Number(limit));
    }

    async findById(id: string): Promise<ProductDetail> {
        return this.prisma.product.findUnique({
            where: { id },
            select: PRODUCT_DETAIL_SELECT,
        });
    }

    async findByVariantId(variantId: string): Promise<ProductDetail> {
        return this.prisma.product.findFirst({
            where: {
                variants: {
                    some: {
                        id: variantId,
                    },
                },
                deleted_at: null,
            },
            select: PRODUCT_DETAIL_SELECT,
        });
    }

    async findBySlug(slug: string): Promise<ProductDetail> {
        return this.prisma.product.findUnique({
            where: {
                slug,
            },
            select: PRODUCT_DETAIL_SELECT,
        });
    }

    async findBySlugAndSku(slug: string, sku: string): Promise<ProductDetail> {
        return this.prisma.product.findUnique({
            where: {
                slug,
            },
            select: {
                variants: {
                    where: {
                        sku,
                    },
                },
                ...PRODUCT_DETAIL_SELECT,
            },
        });
    }

    private queryBuilder(request: Request): ProductWhereInput {
        const { category, brand, price_min, price_max, search, status, is_deleted } = request.query;

        const query: ProductWhereInput = {};

        if (category) {
            query.category = {
                slug: category as string,
            };
        }

        if (brand) {
            query.brand = {
                slug: brand as string,
            };
        }

        if (search) {
            query.name = {
                contains: search as string,
            };
        }

        if (price_min) {
            query.variants.some.price = {
                gte: Number(price_min),
            };
        }

        if (price_max) {
            query.variants.some.price = {
                lte: Number(price_max),
            };
        }

        if (status) {
            query.variants.some.status = status as VariantStatus;
        }

        if (is_deleted) {
            query.variants.some.deleted_at = is_deleted === 'true' ? null : new Date();
        }

        const where: ProductWhereInput = {
            ...query,
        };

        if (price_min || price_max) {
            where.variants.some.price = {};
            if (price_min) {
                where.variants.some.price.gte = Number(price_min);
            }
            if (price_max) {
                where.variants.some.price.lte = Number(price_max);
            }
        }

        return where;
    }
}
