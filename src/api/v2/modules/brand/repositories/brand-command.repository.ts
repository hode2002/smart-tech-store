import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { BRAND_FULL_SELECT } from '@/prisma/selectors';
import { BRAND_TOKENS } from '@v2/modules/brand/constants';
import { IBrandCommandRepository, IBrandMediaDeleteHandler } from '@v2/modules/brand/interfaces';
import { BrandCreateInput, BrandUpdateInput } from '@v2/modules/brand/types';

@Injectable()
export class BrandCommandRepository implements IBrandCommandRepository {
    constructor(
        private readonly prisma: PrismaService,
        @Inject(BRAND_TOKENS.HANDLERS.MEDIA_DELETE)
        private readonly mediaHandler: IBrandMediaDeleteHandler,
    ) {}

    async create(data: BrandCreateInput) {
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

    async update(id: string, data: BrandUpdateInput) {
        return this.prisma.$transaction(async tx => {
            try {
                const brand = await tx.brand.update({
                    where: { id },
                    data,
                    select: BRAND_FULL_SELECT,
                });

                return brand;
            } catch (error) {
                await this.mediaHandler.deleteLogo(data.logo_url as string);
                throw new BadRequestException(error);
            }
        });
    }

    async softDelete(id: string) {
        await this.prisma.brand.update({
            where: { id },
            data: { deleted_at: new Date() },
        });
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
