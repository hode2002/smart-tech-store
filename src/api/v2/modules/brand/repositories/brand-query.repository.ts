import { Injectable } from '@nestjs/common';

import { formatPagination } from '@/common/helpers';
import { PrismaService } from '@/prisma/prisma.service';
import { BRAND_FULL_SELECT } from '@/prisma/selectors';
import { IBrandQueryRepository } from '@v2/modules/brand/interfaces';
import { BrandWhereInput, BrandWhereUniqueInput } from '@v2/modules/brand/types';

@Injectable()
export class BrandQueryRepository implements IBrandQueryRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findBySlug(slug: string) {
        return this.prisma.brand.findFirst({
            where: { slug },
            select: BRAND_FULL_SELECT,
        });
    }

    async findById(id: string, where: BrandWhereUniqueInput) {
        return this.prisma.brand.findUnique({
            where: { id, ...where },
            select: BRAND_FULL_SELECT,
        });
    }

    async findAll(page: number, limit: number, where: BrandWhereInput) {
        const skip = (page - 1) * limit;
        const [brands, total] = await Promise.all([
            this.prisma.brand.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'asc' },
                select: BRAND_FULL_SELECT,
            }),
            this.prisma.brand.count({ where }),
        ]);
        return formatPagination({ brands }, total, page, limit);
    }
}
