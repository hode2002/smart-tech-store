import { Inject, Injectable } from '@nestjs/common';

import { CATEGORY_TOKENS } from '@v2/modules/category/constants';
import { CreateCategoryDto, UpdateCategoryDto } from '@v2/modules/category/dto';
import {
    ICategoryQueryService,
    ICategoryCommandService,
    ICategoryService,
} from '@v2/modules/category/interfaces';

@Injectable()
export class CategoryService implements ICategoryService {
    constructor(
        @Inject(CATEGORY_TOKENS.SERVICES.COMMAND)
        private readonly categoryCommandService: ICategoryCommandService,
        @Inject(CATEGORY_TOKENS.SERVICES.QUERY)
        private readonly categoryQueryService: ICategoryQueryService,
    ) {}

    async create(createCategoryDto: CreateCategoryDto) {
        return this.categoryCommandService.create(createCategoryDto);
    }

    async findAll(page = 1, limit = 10) {
        return this.categoryQueryService.findAll(page, limit, { deleted_at: null });
    }

    async adminFindAll(page = 1, limit = 10) {
        return this.categoryQueryService.findAll(page, limit);
    }

    async findBySlug(slug: string) {
        return this.categoryQueryService.findBySlug(slug);
    }

    async findById(id: string) {
        return this.categoryQueryService.findById(id);
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto) {
        return this.categoryCommandService.update(id, updateCategoryDto);
    }

    async softDelete(id: string) {
        return this.categoryCommandService.softDelete(id);
    }

    async permanentlyDelete(id: string) {
        const result = await this.categoryCommandService.permanentlyDelete(id);
        return !!result;
    }

    async restore(id: string) {
        const result = await this.categoryCommandService.restore(id);
        return !!result;
    }
}
