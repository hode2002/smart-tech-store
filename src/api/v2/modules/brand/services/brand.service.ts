import { Injectable } from '@nestjs/common';

import { CreateBrandDto, UpdateBrandDto } from '@v2/modules/brand/dto';
import { BrandQueryService, BrandCommandService } from '@v2/modules/brand/services';
import { BrandWhereInput } from '@v2/modules/brand/types';

@Injectable()
export class BrandService {
    constructor(
        private readonly brandQueryService: BrandQueryService,
        private readonly brandCommandService: BrandCommandService,
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
