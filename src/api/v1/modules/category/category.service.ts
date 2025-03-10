import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { generateSlug } from '@/common/utils';
import { PrismaService } from '@/prisma/prisma.service';
import { CATEGORY_BASIC_SELECT, CATEGORY_FULL_SELECT } from '@/prisma/selectors';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(createCategoryDto: CreateCategoryDto) {
        const slug = generateSlug(createCategoryDto.name);

        const isExist = await this.findBySlug(slug);
        if (isExist) {
            throw new ConflictException('Category Already Exists');
        }

        return await this.prismaService.category.create({
            data: {
                ...createCategoryDto,
                slug,
            },
            select: CATEGORY_BASIC_SELECT,
        });
    }

    async findAll() {
        return await this.prismaService.category.findMany({
            where: {
                is_deleted: false,
            },
            select: CATEGORY_BASIC_SELECT,
        });
    }

    async adminFindAll() {
        return await this.prismaService.category.findMany({
            select: CATEGORY_FULL_SELECT,
        });
    }

    async findBySlug(slug: string) {
        return await this.prismaService.category.findFirst({
            where: { slug, is_deleted: false },
            select: CATEGORY_BASIC_SELECT,
        });
    }

    async findById(id: string) {
        const category = await this.prismaService.category.findUnique({
            where: { id, is_deleted: false },
            select: CATEGORY_BASIC_SELECT,
        });

        if (!category) {
            throw new NotFoundException('Category Not Found');
        }

        return category;
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto) {
        const isExist = await this.prismaService.category.findUnique({
            where: { id },
        });
        if (!isExist) {
            throw new NotFoundException('Category Not Found');
        }

        return await this.prismaService.category.update({
            where: { id },
            data: updateCategoryDto,
            select: CATEGORY_BASIC_SELECT,
        });
    }

    async remove(id: string) {
        const isExist = await this.findById(id);
        if (!isExist) {
            throw new NotFoundException('Category Not Found');
        }

        const isDeleted = await this.prismaService.category.update({
            where: { id },
            data: { is_deleted: true },
        });

        return {
            is_success: isDeleted ? true : false,
        };
    }

    async restore(id: string) {
        const isExist = await this.prismaService.category.findUnique({
            where: { id, is_deleted: true },
        });
        if (!isExist) {
            throw new NotFoundException('Category Not Found');
        }

        const isDeleted = await this.prismaService.category.update({
            where: { id },
            data: { is_deleted: false },
        });

        return {
            is_success: isDeleted ? true : false,
        };
    }
}
