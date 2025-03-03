import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';

import { MediaService } from 'src/media/media.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BRAND_BASIC_SELECT, BRAND_FULL_SELECT } from 'src/prisma/selectors';
import { generateSlug } from 'src/utils';

import { CreateBrandDto, UpdateBrandDto } from './dto';

@Injectable()
export class BrandService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly mediaService: MediaService,
    ) {}

    async create(createBrandDto: CreateBrandDto, file: Express.Multer.File) {
        const slug = generateSlug(createBrandDto.name);

        const isExist = await this.findBySlug(slug);
        if (isExist) {
            throw new ConflictException('Brand Already Exists');
        }

        const res = await this.mediaService.uploadV2(file);
        if (!res?.public_id) {
            throw new InternalServerErrorException(res.message);
        }

        const imageUrl = res?.url;
        return await this.prismaService.brand.create({
            data: {
                ...createBrandDto,
                logo_url: imageUrl,
                slug,
            },
            select: BRAND_BASIC_SELECT,
        });
    }

    async findAll() {
        return await this.prismaService.brand.findMany({
            where: {
                is_deleted: false,
            },
            select: BRAND_BASIC_SELECT,
        });
    }

    async adminFindAll() {
        return await this.prismaService.brand.findMany({
            select: BRAND_FULL_SELECT,
        });
    }

    async findBySlug(slug: string) {
        return await this.prismaService.brand.findFirst({
            where: { slug, is_deleted: false },
            select: BRAND_BASIC_SELECT,
        });
    }

    async findById(id: string) {
        const brand = await this.prismaService.brand.findUnique({
            where: { id, is_deleted: false },
            select: BRAND_BASIC_SELECT,
        });

        if (!brand) {
            throw new NotFoundException('Brand Not Found');
        }

        return brand;
    }

    async findByCategory(slug: string) {
        const brands = await this.prismaService.brand.findMany({
            where: {
                products: {
                    some: {
                        category: {
                            slug,
                        },
                    },
                },
                is_deleted: false,
            },
            select: BRAND_BASIC_SELECT,
        });

        return brands;
    }

    async update(id: string, updateBrandDto: UpdateBrandDto, file: Express.Multer.File) {
        const brand = await this.findById(id);
        let logo_url = brand.logo_url;

        if (file?.size) {
            const res = await this.mediaService.uploadV2(file);
            if (!res?.public_id) {
                throw new InternalServerErrorException(res.message);
            }
            logo_url = res.url;
            await this.mediaService.deleteV2(brand.logo_url);
        }

        return await this.prismaService.brand.update({
            where: { id },
            data: {
                ...updateBrandDto,
                logo_url,
            },
            select: BRAND_BASIC_SELECT,
        });
    }

    async remove(id: string) {
        const isExist = await this.findById(id);
        if (!isExist) {
            throw new NotFoundException('Brand Not Found');
        }

        const isDeleted = await this.prismaService.brand.update({
            where: { id },
            data: { is_deleted: true },
        });

        return {
            is_success: isDeleted ? true : false,
        };
    }

    async restore(id: string) {
        const isExist = await this.prismaService.brand.findUnique({
            where: { id, is_deleted: true },
        });
        if (!isExist) {
            throw new NotFoundException('Brand Not Found');
        }

        const isDeleted = await this.prismaService.brand.update({
            where: { id },
            data: { is_deleted: false },
        });

        return {
            is_success: isDeleted ? true : false,
        };
    }
}
