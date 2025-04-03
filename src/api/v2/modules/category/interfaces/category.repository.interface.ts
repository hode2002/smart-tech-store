import { Pagination } from '@/common/types';
import { CategoryFull } from '@/prisma/selectors';
import {
    CategoryCreateInput,
    CategoryUpdateInput,
    CategoryWhereInput,
} from '@v2/modules/category/types';

export interface ICategoryQueryRepository {
    findById(id: string, where?: CategoryWhereInput): Promise<CategoryFull>;
    findBySlug(slug: string, where?: CategoryWhereInput): Promise<CategoryFull>;
    findAll(
        page: number,
        limit: number,
        where?: CategoryWhereInput,
    ): Promise<Pagination<CategoryFull>>;
}

export interface ICategoryCommandRepository {
    create(data: CategoryCreateInput): Promise<CategoryFull>;
    update(id: string, data: CategoryUpdateInput): Promise<CategoryFull>;
    softDelete(id: string): Promise<boolean>;
    permanentlyDelete(id: string): Promise<boolean>;
}

export interface ICategoryRepository extends ICategoryQueryRepository, ICategoryCommandRepository {}
