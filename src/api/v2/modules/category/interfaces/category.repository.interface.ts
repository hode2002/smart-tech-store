import { Category } from '@prisma/client';

import { Pagination } from '@/common/types';
import { CreateCategoryDto, UpdateCategoryDto } from '@v2/modules/category/dto';
import { CategoryWhereInput } from '@v2/modules/category/types';

export interface ICategoryQueryRepository {
    findById(id: string, where?: CategoryWhereInput): Promise<Category>;
    findBySlug(slug: string, where?: CategoryWhereInput): Promise<Category>;
    findAll(page: number, limit: number, where?: CategoryWhereInput): Promise<Pagination<Category>>;
}

export interface ICategoryCommandRepository {
    create(data: CreateCategoryDto & { slug: string }): Promise<Category>;
    update(id: string, data: UpdateCategoryDto): Promise<Category>;
    softDelete(id: string): Promise<boolean>;
    permanentlyDelete(id: string): Promise<boolean>;
}

export interface ICategoryRepository extends ICategoryQueryRepository, ICategoryCommandRepository {}
