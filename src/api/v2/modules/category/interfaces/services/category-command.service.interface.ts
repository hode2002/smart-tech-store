import { CategoryFull } from '@/prisma/selectors';
import { CreateCategoryDto, UpdateCategoryDto } from '@v2/modules/category/dto';

export interface ICategoryCommandService {
    create(createCategoryDto: CreateCategoryDto): Promise<CategoryFull>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryFull>;
    softDelete(id: string): Promise<boolean>;
    permanentlyDelete(id: string): Promise<boolean>;
    restore(id: string): Promise<boolean>;
}
