import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { CATEGORY_FULL_SELECT } from '@/prisma/selectors';
import { CreateCategoryDto, UpdateCategoryDto } from '@v2/modules/category/dto';
import { ICategoryCommandRepository } from '@v2/modules/category/interfaces';

@Injectable()
export class CategoryCommandRepository implements ICategoryCommandRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateCategoryDto & { slug: string }) {
        return await this.prisma.category.create({ data, select: CATEGORY_FULL_SELECT });
    }

    async update(id: string, data: UpdateCategoryDto) {
        return await this.prisma.category.update({
            where: { id },
            data,
            select: CATEGORY_FULL_SELECT,
        });
    }

    async softDelete(id: string) {
        await this.prisma.category.update({ where: { id }, data: { is_deleted: true } });
        return true;
    }

    async permanentlyDelete(id: string) {
        await this.prisma.category.delete({ where: { id } });
        return true;
    }
}
