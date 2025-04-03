import { Inject, Injectable } from '@nestjs/common';

import { CATEGORY_TOKENS } from '@v2/modules/category/constants';
import { ICategoryQueryRepository, ICategoryQueryService } from '@v2/modules/category/interfaces';
import { CategoryWhereInput } from '@v2/modules/category/types';
import { CommonService } from '@v2/modules/common/common.service';

@Injectable()
export class CategoryQueryService implements ICategoryQueryService {
    constructor(
        @Inject(CATEGORY_TOKENS.REPOSITORIES.QUERY)
        private readonly categoryRepo: ICategoryQueryRepository,
        private readonly commonService: CommonService,
    ) {}

    async findAll(page = 1, limit = 10, where?: CategoryWhereInput) {
        return this.categoryRepo.findAll(page, limit, where);
    }

    async findBySlug(slug: string, passthrough = false) {
        const category = await this.categoryRepo.findBySlug(slug, { deleted_at: null });
        if (passthrough) {
            return category;
        }
        return this.commonService.checkNotFound(category, 'Category not found');
    }

    async findById(id: string, where?: CategoryWhereInput, passthrough = false) {
        const category = await this.categoryRepo.findById(id, { deleted_at: null, ...where });

        if (passthrough) {
            return category;
        }
        return this.commonService.checkNotFound(category, 'Category not found');
    }
}
