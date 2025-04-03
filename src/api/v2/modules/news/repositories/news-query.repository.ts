import { Injectable } from '@nestjs/common';

import { formatPagination } from '@/common/helpers';
import { PrismaService } from '@/prisma/prisma.service';
import { NEWS_FULL_SELECT_WITH_CATEGORY } from '@/prisma/selectors/news';
import { INewsQueryRepository } from '@v2/modules/news/interfaces';
import { NewsWhereInput } from '@v2/modules/news/types';

@Injectable()
export class NewsQueryRepository implements INewsQueryRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findById(id: string) {
        return this.prisma.news.findUnique({
            where: { id },
            select: NEWS_FULL_SELECT_WITH_CATEGORY,
        });
    }

    async findBySlug(slug: string) {
        return this.prisma.news.findFirst({
            where: { slug },
            select: NEWS_FULL_SELECT_WITH_CATEGORY,
        });
    }

    async findAll(page: number, limit: number, where?: NewsWhereInput) {
        const skip = (page - 1) * limit;
        const [news, total] = await Promise.all([
            this.prisma.news.findMany({
                skip,
                take: limit,
                orderBy: { created_at: 'desc' },
                where,
                select: NEWS_FULL_SELECT_WITH_CATEGORY,
            }),
            this.prisma.news.count({ where }),
        ]);
        return formatPagination({ news }, total, page, limit);
    }
}
