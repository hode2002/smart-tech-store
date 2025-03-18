import { Inject, Injectable } from '@nestjs/common';

import { CATEGORY_QUERY_REPOSITORY } from '@v2/modules/category/constants';
import { ICategoryQueryRepository } from '@v2/modules/category/interfaces';
import { CategoryWhereInput } from '@v2/modules/category/types';
import { CommonService } from '@v2/modules/common/common.service';

@Injectable()
export class CategoryQueryService {
    constructor(
        @Inject(CATEGORY_QUERY_REPOSITORY)
        private readonly categoryRepo: ICategoryQueryRepository,
        private readonly commonService: CommonService,
    ) {}

    async findAll(page = 1, limit = 10, where?: CategoryWhereInput) {
        return this.categoryRepo.findAll(page, limit, where);
    }

    async findBySlug(slug: string, passthrough = false) {
        const category = await this.categoryRepo.findBySlug(slug, { is_deleted: false });
        if (passthrough) {
            return category;
        }
        return this.commonService.checkNotFound(category, 'Category not found');
    }

    async findById(id: string, where?: CategoryWhereInput, passthrough = false) {
        const category = await this.categoryRepo.findById(id, { is_deleted: false, ...where });

        if (passthrough) {
            return category;
        }
        return this.commonService.checkNotFound(category, 'Category not found');
    }
}
