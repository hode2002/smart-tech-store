import { Category } from '@prisma/client';

import { Pagination } from '@/common/types';
import { CreateCategoryDto, UpdateCategoryDto } from '@v2/modules/category/dto';

export interface ICategoryService {
    create(createCategoryDto: CreateCategoryDto): Promise<Category>;
    findAll(page?: number, limit?: number): Promise<Pagination<Category>>;
    adminFindAll(page?: number, limit?: number): Promise<Pagination<Category>>;
    findBySlug(slug: string): Promise<Category>;
    findById(id: string): Promise<Category>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category>;
    softDelete(id: string): Promise<boolean>;
    permanentlyDelete(id: string): Promise<boolean>;
    restore(id: string): Promise<Category>;
}
