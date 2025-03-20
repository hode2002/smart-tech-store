import { Injectable } from '@nestjs/common';

import { formatPagination } from '@/common/helpers';
import { PrismaService } from '@/prisma/prisma.service';
import { INewsQueryRepository } from '@v2/modules/news/interfaces';

@Injectable()
export class NewsQueryRepository implements INewsQueryRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findById(id: string) {
        return this.prisma.news.findUnique({
            where: { id },
        });
    }

    async findBySlug(slug: string) {
        return this.prisma.news.findFirst({
            where: { slug },
        });
    }

    async findAll(page: number, limit: number) {
        const skip = (page - 1) * limit;
        const [news, total] = await Promise.all([
            this.prisma.news.findMany({
                skip,
                take: limit,
                orderBy: { created_at: 'desc' },
            }),
            this.prisma.news.count(),
        ]);
        return formatPagination({ news }, total, page, limit);
    }
}
