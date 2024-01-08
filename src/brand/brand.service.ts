import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateBrandDto, UpdateBrandDto } from './dto';
import { PrismaService } from './../prisma/prisma.service';
import slugify from 'slugify';

@Injectable()
export class BrandService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(createBrandDto: CreateBrandDto) {
        const slug = slugify(createBrandDto.name, {
            replacement: '-',
            remove: undefined,
            lower: true,
            strict: false,
            locale: 'vi',
            trim: true,
        });

        const isExist = await this.findBySlug(slug);
        if (isExist) {
            throw new ConflictException('Brand Already Exists');
        }

        return await this.prismaService.brand.create({
            data: {
                ...createBrandDto,
                slug,
            },
            select: {
                id: true,
                name: true,
                description: true,
                logo_url: true,
                slug: true,
            },
        });
    }

    async findAll() {
        return await this.prismaService.brand.findMany({
            where: { is_deleted: false },
            select: {
                id: true,
                name: true,
                description: true,
                logo_url: true,
                slug: true,
            },
        });
    }

    async findBySlug(slug: string) {
        return await this.prismaService.brand.findFirst({
            where: { slug, is_deleted: false },
            select: {
                id: true,
                name: true,
                description: true,
                logo_url: true,
                slug: true,
            },
        });
    }

    async findById(id: number) {
        const brand = await this.prismaService.brand.findUnique({
            where: { id, is_deleted: false },
            select: {
                id: true,
                name: true,
                description: true,
                logo_url: true,
                slug: true,
            },
        });

        if (!brand) {
            throw new NotFoundException('Brand Not Found');
        }

        return brand;
    }

    async update(id: number, updateBrandDto: UpdateBrandDto) {
        const isExist = await this.prismaService.category.findUnique({
            where: { id },
        });
        if (!isExist) {
            throw new NotFoundException('Brand Not Found');
        }

        return await this.prismaService.brand.update({
            where: { id },
            data: updateBrandDto,
            select: {
                id: true,
                name: true,
                description: true,
                logo_url: true,
                slug: true,
            },
        });
    }

    async remove(id: number) {
        const isExist = await this.findById(id);
        if (!isExist) {
            throw new NotFoundException('Brand Not Found');
        }

        return await this.update(id, { is_deleted: true });
    }
}
