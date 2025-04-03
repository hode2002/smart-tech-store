import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { BANNER_FULL_SELECT } from '@/prisma/selectors';
import { IBannerCommandRepository } from '@v2/modules/banner/interfaces';
import { BannerCreateInput, BannerUpdateInput } from '@v2/modules/banner/types';

@Injectable()
export class BannerCommandRepository implements IBannerCommandRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: BannerCreateInput) {
        return this.prisma.banner.create({
            data,
            select: BANNER_FULL_SELECT,
        });
    }

    async update(id: string, data: BannerUpdateInput) {
        return this.prisma.banner.update({
            where: { id },
            data,
            select: BANNER_FULL_SELECT,
        });
    }

    async delete(id: string) {
        await this.prisma.banner.delete({ where: { id } });
        return true;
    }
}
