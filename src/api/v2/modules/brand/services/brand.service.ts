import { Inject, Injectable } from '@nestjs/common';

import { BRAND_TOKENS } from '@v2/modules/brand/constants';
import { CreateBrandDto, UpdateBrandDto } from '@v2/modules/brand/dto';
import {
    IBrandCommandService,
    IBrandQueryService,
    IBrandService,
} from '@v2/modules/brand/interfaces';
import { BrandWhereInput } from '@v2/modules/brand/types';

@Injectable()
export class BrandService implements IBrandService {
    constructor(
        @Inject(BRAND_TOKENS.SERVICES.QUERY)
        private readonly brandQueryService: IBrandQueryService,
        @Inject(BRAND_TOKENS.SERVICES.COMMAND)
        private readonly brandCommandService: IBrandCommandService,
    ) {}
    async create(createBrandDto: CreateBrandDto, file: Express.Multer.File) {
        return this.brandCommandService.create(createBrandDto, file);
    }

    async findAll(page = 1, limit = 10) {
        return this.brandQueryService.findAll(page, limit);
    }

    async adminFindAll(page = 1, limit = 10) {
        return this.brandQueryService.adminFindAll(page, limit);
    }

    async findBySlug(slug: string) {
        return this.brandQueryService.findBySlug(slug);
    }

    async findById(id: string, where?: BrandWhereInput) {
        return this.brandQueryService.findById(id, where);
    }

    async findByCategory(slug: string, page = 1, limit = 10) {
        return this.brandQueryService.findByCategory(slug, page, limit);
    }

    async update(id: string, updateBrandDto: UpdateBrandDto, file: Express.Multer.File) {
        return this.brandCommandService.update(id, updateBrandDto, file);
    }

    async softDelete(id: string) {
        return this.brandCommandService.softDelete(id);
    }

    async permanentlyDelete(id: string) {
        return this.brandCommandService.permanentlyDelete(id);
    }

    async restore(id: string) {
        return this.brandCommandService.restore(id);
    }
}
