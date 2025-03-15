import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { BrandBasic, BrandFull } from '@/prisma/selectors';
import { BRAND_QUERY_REPOSITORY } from '@v2/modules/brand/constants';
import { IBrandQueryRepository } from '@v2/modules/brand/interfaces';
import { BrandWhereInput } from '@v2/modules/brand/types';

@Injectable()
export class BrandQueryService {
    constructor(
        @Inject(BRAND_QUERY_REPOSITORY)
        private readonly brandRepo: IBrandQueryRepository,
    ) {}

    private checkNotFound(brand: BrandBasic | BrandFull) {
        if (!brand) {
            throw new NotFoundException('Brand not found');
        }
        return brand;
    }

    async findAll(page = 1, limit = 10) {
        return this.brandRepo.findAll(page, limit, { is_deleted: false });
    }

    async adminFindAll(page = 1, limit = 10) {
        return this.brandRepo.findAll(page, limit, {});
    }

    async findBySlug(slug: string, passthrough = false) {
        const brand = await this.brandRepo.findBySlug(slug, { is_deleted: false });
        if (passthrough) {
            return brand;
        }
        return this.checkNotFound(brand);
    }

    async findById(id: string, where?: BrandWhereInput, passthrough = false) {
        const brand = await this.brandRepo.findById(id, { is_deleted: false, ...where });
        if (passthrough) {
            return brand;
        }
        return this.checkNotFound(brand);
    }

    async findByCategory(slug: string, page = 1, limit = 10) {
        const where = {
            products: {
                some: {
                    category: {
                        slug,
                    },
                },
            },
            is_deleted: false,
        };
        return this.brandRepo.findAll(page, limit, where);
    }
}
