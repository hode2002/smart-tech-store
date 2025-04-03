import { Pagination } from '@/common/types';
import { CategoryFull } from '@/prisma/selectors';
import { CategoryWhereInput } from '@v2/modules/category/types';

export interface ICategoryQueryService {
    findAll(
        page?: number,
        limit?: number,
        where?: CategoryWhereInput,
    ): Promise<Pagination<CategoryFull>>;
    findBySlug(slug: string, passthrough?: boolean): Promise<CategoryFull>;
    findById(id: string, where?: CategoryWhereInput, passthrough?: boolean): Promise<CategoryFull>;
}
