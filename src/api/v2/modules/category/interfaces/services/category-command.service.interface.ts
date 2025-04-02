import { Category } from '@prisma/client';

import { CreateCategoryDto, UpdateCategoryDto } from '@v2/modules/category/dto';

export interface ICategoryCommandService {
    create(createCategoryDto: CreateCategoryDto): Promise<Category>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category>;
    softDelete(id: string): Promise<boolean>;
    permanentlyDelete(id: string): Promise<boolean>;
    restore(id: string): Promise<Category>;
}
