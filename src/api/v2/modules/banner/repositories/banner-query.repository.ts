import { Injectable } from '@nestjs/common';
import { Banner, BannerStatus } from '@prisma/client';

import { formatPagination } from '@/common/helpers';
import { Pagination } from '@/common/types';
import { PrismaService } from '@/prisma/prisma.service';
import { BANNER_FULL_SELECT } from '@/prisma/selectors';
import { IBannerQueryRepository } from '@v2/modules/banner/interfaces';
import { BannerWhereInput, BannerWhereUniqueInput } from '@v2/modules/banner/types';

@Injectable()
export class BannerQueryRepository implements IBannerQueryRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findBySlug(slug: string): Promise<Banner> {
        return this.prisma.banner.findFirst({
            where: { slug, status: BannerStatus.ACTIVE },
            select: BANNER_FULL_SELECT,
        });
    }

    async findById(id: string, where?: BannerWhereUniqueInput): Promise<Banner> {
        return this.prisma.banner.findUnique({
            where: { id, ...where },
            select: BANNER_FULL_SELECT,
        });
    }

    async findAll(
        page: number,
        limit: number,
        where: BannerWhereInput,
    ): Promise<Pagination<Banner>> {
        const skip = (page - 1) * limit;
        const [banners, total] = await Promise.all([
            this.prisma.banner.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'asc' },
                select: BANNER_FULL_SELECT,
            }),
            this.prisma.banner.count({ where }),
        ]);
        return formatPagination({ banners }, total, page, limit);
    }
}
