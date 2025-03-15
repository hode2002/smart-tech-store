import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { BRAND_FULL_SELECT } from '@/prisma/selectors';
import { BRAND_MEDIA_DELETE_HANDLER } from '@v2/modules/brand/constants';
import { CreateBrandDto, UpdateBrandDto } from '@v2/modules/brand/dto';
import { IBrandCommandRepository, IBrandMediaDeleteHandler } from '@v2/modules/brand/interfaces';

@Injectable()
export class BrandCommandRepository implements IBrandCommandRepository {
    constructor(
        private readonly prisma: PrismaService,
        @Inject(BRAND_MEDIA_DELETE_HANDLER)
        private readonly mediaHandler: IBrandMediaDeleteHandler,
    ) {}

    async create(data: CreateBrandDto & { slug: string; logo_url: string }) {
        return this.prisma.$transaction(async tx => {
            try {
                const brand = await tx.brand.create({ data, select: BRAND_FULL_SELECT });
                return brand;
            } catch (error) {
                await this.mediaHandler.deleteLogo(data.logo_url);
                throw new BadRequestException(error);
            }
        });
    }

    async update(id: string, data: UpdateBrandDto & { logo_url?: string }) {
        return this.prisma.$transaction(async tx => {
            try {
                const brand = await tx.brand.update({
                    where: { id },
                    data,
                    select: BRAND_FULL_SELECT,
                });

                return brand;
            } catch (error) {
                await this.mediaHandler.deleteLogo(data.logo_url);
                throw new BadRequestException(error);
            }
        });
    }

    async softDelete(id: string) {
        await this.prisma.brand.update({ where: { id }, data: { is_deleted: true } });
        return true;
    }

    async permanentlyDelete(id: string) {
        return this.prisma.$transaction(async tx => {
            try {
                const brand = await tx.brand.delete({ where: { id } });
                await this.mediaHandler.deleteLogo(brand.logo_url);
                return true;
            } catch (error) {
                throw new BadRequestException(error);
            }
        });
    }
}
