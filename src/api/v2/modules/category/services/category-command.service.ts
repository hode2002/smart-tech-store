import { ConflictException, Inject, Injectable } from '@nestjs/common';

import { generateSlug } from '@/common/utils';
import { CATEGORY_TOKENS } from '@v2/modules/category/constants';
import { CreateCategoryDto, UpdateCategoryDto } from '@v2/modules/category/dto';
import {
    ICategoryCommandRepository,
    ICategoryCommandService,
    ICategoryQueryService,
} from '@v2/modules/category/interfaces';

@Injectable()
export class CategoryCommandService implements ICategoryCommandService {
    constructor(
        @Inject(CATEGORY_TOKENS.REPOSITORIES.COMMAND)
        private readonly categoryRepo: ICategoryCommandRepository,
        @Inject(CATEGORY_TOKENS.SERVICES.QUERY)
        private readonly categoryQueryService: ICategoryQueryService,
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
        await this.categoryQueryService.findById(
            id,
            {
                deleted_at: { not: null },
            },
            true,
        );

        const data = { deleted_at: null };
        return this.categoryRepo.update(id, data);
    }
}
