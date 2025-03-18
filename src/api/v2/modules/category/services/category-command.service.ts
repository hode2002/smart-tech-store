import { ConflictException, Inject, Injectable } from '@nestjs/common';

import { generateSlug } from '@/common/utils';
import { CATEGORY_COMMAND_REPOSITORY } from '@v2/modules/category/constants';
import { CreateCategoryDto, UpdateCategoryDto } from '@v2/modules/category/dto';
import { ICategoryCommandRepository } from '@v2/modules/category/interfaces';
import { CategoryQueryService } from '@v2/modules/category/services';

@Injectable()
export class CategoryCommandService {
    constructor(
        @Inject(CATEGORY_COMMAND_REPOSITORY)
        private readonly categoryRepo: ICategoryCommandRepository,
        private readonly categoryQueryService: CategoryQueryService,
    ) {}

    async create(createCategoryDto: CreateCategoryDto) {
        const slug = generateSlug(createCategoryDto.name);

        const existingCategory = await this.categoryQueryService.findBySlug(slug, true);
        if (existingCategory) {
            throw new ConflictException('Category Already Exists');
        }
        const data = {
            slug,
            ...createCategoryDto,
        };

        return this.categoryRepo.create(data);
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto) {
        await this.categoryQueryService.findById(id);
        return this.categoryRepo.update(id, updateCategoryDto);
    }

    async softDelete(id: string) {
        await this.categoryQueryService.findById(id);
        return this.categoryRepo.softDelete(id);
    }

    async permanentlyDelete(id: string) {
        await this.categoryQueryService.findById(id, {}, true);
        return this.categoryRepo.permanentlyDelete(id);
    }

    async restore(id: string) {
        await this.categoryQueryService.findById(id, { is_deleted: true }, true);

        const data = { is_deleted: false };
        return this.categoryRepo.update(id, data);
    }
}
