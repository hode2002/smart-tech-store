import { Pagination } from '@/common/types';
import { CategoryFull } from '@/prisma/selectors';
import { CreateCategoryDto, UpdateCategoryDto } from '@v2/modules/category/dto';
export interface ICategoryService {
    create(createCategoryDto: CreateCategoryDto): Promise<CategoryFull>;
    findAll(page?: number, limit?: number): Promise<Pagination<CategoryFull>>;
    adminFindAll(page?: number, limit?: number): Promise<Pagination<CategoryFull>>;
    findBySlug(slug: string): Promise<CategoryFull>;
    findById(id: string): Promise<CategoryFull>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryFull>;
    softDelete(id: string): Promise<boolean>;
    permanentlyDelete(id: string): Promise<boolean>;
    restore(id: string): Promise<boolean>;
}
