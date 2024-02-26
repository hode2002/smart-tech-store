import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateSlug } from 'src/utils';

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
            select: {
                id: true,
                name: true,
                description: true,
                slug: true,
            },
        });
    }

    async findAll() {
        return await this.prismaService.category.findMany({
            where: {
                is_deleted: false,
            },
            select: {
                id: true,
                name: true,
                description: true,
                slug: true,
            },
        });
    }

    async adminFindAll() {
        return await this.prismaService.category.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                slug: true,
                is_deleted: true,
                created_at: true,
                updated_at: true,
            },
        });
    }

    async findBySlug(slug: string) {
        return await this.prismaService.category.findFirst({
            where: { slug, is_deleted: false },
            select: {
                id: true,
                name: true,
                description: true,
                slug: true,
            },
        });
    }

    async findById(id: string) {
        const category = await this.prismaService.category.findUnique({
            where: { id, is_deleted: false },
            select: {
                id: true,
                name: true,
                description: true,
                slug: true,
            },
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
            select: {
                id: true,
                name: true,
                description: true,
                slug: true,
            },
        });
    }

    async remove(id: string) {
        const isExist = await this.findById(id);
        if (!isExist) {
            throw new NotFoundException('Category Not Found');
        }

        return await this.update(id, { is_deleted: true });
    }
}
