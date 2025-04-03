import { Injectable } from '@nestjs/common';

import { formatPagination } from '@/common/helpers';
import { PrismaService } from '@/prisma/prisma.service';
import { CATEGORY_FULL_SELECT } from '@/prisma/selectors';
import { ICategoryQueryRepository } from '@v2/modules/category/interfaces';
import { CategoryWhereInput, CategoryWhereUniqueInput } from '@v2/modules/category/types';

@Injectable()
export class CategoryQueryRepository implements ICategoryQueryRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findBySlug(slug: string) {
        return this.prisma.category.findFirst({
            where: { slug },
            select: CATEGORY_FULL_SELECT,
        });
    }

    async findById(id: string, where: CategoryWhereUniqueInput) {
        return this.prisma.category.findUnique({
            where: { id, ...where },
            select: CATEGORY_FULL_SELECT,
        });
    }

    async findAll(page: number, limit: number, where: CategoryWhereInput) {
        const skip = (page - 1) * limit;
        const [brands, total] = await Promise.all([
            this.prisma.category.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'asc' },
                select: CATEGORY_FULL_SELECT,
            }),
            this.prisma.category.count({ where }),
        ]);
        return formatPagination({ brands }, total, page, limit);
    }
}
