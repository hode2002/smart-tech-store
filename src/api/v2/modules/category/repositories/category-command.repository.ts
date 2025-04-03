import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { CATEGORY_FULL_SELECT } from '@/prisma/selectors';
import { UpdateCategoryDto } from '@v2/modules/category/dto';
import { ICategoryCommandRepository } from '@v2/modules/category/interfaces';
import { CategoryCreateInput } from '@v2/modules/category/types';

@Injectable()
export class CategoryCommandRepository implements ICategoryCommandRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CategoryCreateInput) {
        return this.prisma.category.create({
            data,
            select: CATEGORY_FULL_SELECT,
        });
    }

    async update(id: string, data: UpdateCategoryDto) {
        return this.prisma.category.update({
            where: { id },
            data,
            select: CATEGORY_FULL_SELECT,
        });
    }

    async softDelete(id: string) {
        const result = await this.prisma.category.update({
            where: { id },
            data: { deleted_at: new Date() },
            select: { id: true },
        });
        return !!result;
    }

    async permanentlyDelete(id: string) {
        const result = await this.prisma.category.delete({
            where: { id },
            select: { id: true },
        });
        return !!result;
    }
}
