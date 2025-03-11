import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { formatPagination } from '@/common/helpers';
import { PrismaService } from '@/prisma/prisma.service';
import { BANNER_BASIC_SELECT, BANNER_FULL_SELECT } from '@/prisma/selectors';
import { CreateBannerDto, UpdateBannerDto } from '@v2/modules/banner/dto';

import { IBannerRepository } from './banner.repository.interface';

export const BANNER_REPOSITORY = Symbol('BANNER_REPOSITORY');

@Injectable()
export class BannerRepository implements IBannerRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findBySlug(slug: string) {
        return this.prisma.banner.findFirst({
            where: { slug, status: 'show' },
            select: BANNER_BASIC_SELECT,
        });
    }

    async findById(id: string, filter: Prisma.BannerWhereUniqueInput) {
        return this.prisma.banner.findUnique({
            where: { id, ...filter },
            select: BANNER_FULL_SELECT,
        });
    }

    async findBanners(where: Prisma.BannerWhereInput, page: number, limit: number) {
        const skip = (page - 1) * limit;
        const [banners, total] = await Promise.all([
            this.prisma.banner.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'asc' },
                select: BANNER_BASIC_SELECT,
            }),
            this.prisma.banner.count({ where }),
        ]);
        return formatPagination({ banners }, total, page, limit);
    }

    async create(data: CreateBannerDto, image: string, slug: string) {
        return this.prisma.banner.create({
            data: { ...data, image, slug },
            select: BANNER_BASIC_SELECT,
        });
    }

    async update(id: string, data: UpdateBannerDto, image?: string) {
        return this.prisma.banner.update({
            where: { id },
            data: { ...data, ...(image ? { image } : {}) },
            select: BANNER_BASIC_SELECT,
        });
    }

    async delete(id: string) {
        await this.prisma.banner.delete({ where: { id } });
        return true;
    }
}
