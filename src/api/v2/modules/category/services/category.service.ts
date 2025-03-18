import { Injectable } from '@nestjs/common';
import { CategoryCommandService } from '@v2/modules/category/services';
import { CategoryQueryService } from '@v2/modules/category/services/category-query.service';

import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoryService {
    constructor(
        private readonly categoryCommandService: CategoryCommandService,
        private readonly categoryQueryService: CategoryQueryService,
    ) {}

    async create(createCategoryDto: CreateCategoryDto) {
        return this.categoryCommandService.create(createCategoryDto);
    }

    async findAll(page = 1, limit = 10) {
        return this.categoryQueryService.findAll(page, limit, { is_deleted: false });
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
        return this.categoryCommandService.permanentlyDelete(id);
    }

    async restore(id: string) {
        return this.categoryCommandService.restore(id);
    }
}
