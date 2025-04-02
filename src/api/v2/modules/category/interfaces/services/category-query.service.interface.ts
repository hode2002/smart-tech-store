import { Category } from '@prisma/client';

import { Pagination } from '@/common/types';
import { CategoryWhereInput } from '@v2/modules/category/types';

export interface ICategoryQueryService {
    findAll(
        page?: number,
        limit?: number,
        where?: CategoryWhereInput,
    ): Promise<Pagination<Category>>;
    findBySlug(slug: string, passthrough?: boolean): Promise<Category>;
    findById(id: string, where?: CategoryWhereInput, passthrough?: boolean): Promise<Category>;
}
