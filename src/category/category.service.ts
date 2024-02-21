import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import slugify from 'slugify';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(createCategoryDto: CreateCategoryDto) {
        const slug = slugify(createCategoryDto.name, {
            replacement: '-',
            remove: undefined,
            lower: true,
            strict: false,
            locale: 'vi',
            trim: true,
        });

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
            select: {
                id: true,
                name: true,
                description: true,
                slug: true,
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

    async findById(id: number) {
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

    async update(id: number, updateCategoryDto: UpdateCategoryDto) {
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

    async remove(id: number) {
        const isExist = await this.findById(id);
        if (!isExist) {
            throw new NotFoundException('Category Not Found');
        }

        return await this.update(id, { is_deleted: true });
    }
}
