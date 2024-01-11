import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { CreateBrandDto, UpdateBrandDto } from './dto';
import { PrismaService } from './../prisma/prisma.service';
import slugify from 'slugify';
import { FileUploadDto } from 'src/media/dto';
import { MediaService } from 'src/media/media.service';

@Injectable()
export class BrandService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly mediaService: MediaService,
    ) {}

    async create(createBrandDto: CreateBrandDto, fileUploadDto: FileUploadDto) {
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

        const res = await this.mediaService.upload(fileUploadDto);
        if (!res?.is_success) {
            throw new InternalServerErrorException('Internal Server Error');
        }

        const awsKey = res?.key;
        if (!awsKey) {
            throw new InternalServerErrorException('Internal Server Error');
        }

        return await this.prismaService.brand.create({
            data: {
                ...createBrandDto,
                logo_url: awsKey,
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

    async update(
        id: number,
        updateBrandDto: UpdateBrandDto,
        fileUploadDto: FileUploadDto,
    ) {
        const brand = await this.findById(id);

        const res = await this.mediaService.upload(fileUploadDto);
        if (!res?.is_success) {
            throw new InternalServerErrorException('Internal Server Error');
        }

        const awsKey = res?.key;
        if (!awsKey) {
            throw new InternalServerErrorException('Internal Server Error');
        }

        await this.mediaService.deleteFileS3(brand.logo_url);

        return await this.prismaService.brand.update({
            where: { id },
            data: {
                ...updateBrandDto,
                logo_url: awsKey,
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

    async remove(id: number) {
        const isExist = await this.findById(id);
        if (!isExist) {
            throw new NotFoundException('Banner Not Found');
        }

        const isDeleted = await this.prismaService.brand.update({
            where: { id },
            data: { is_deleted: true },
            select: {
                id: true,
                name: true,
                logo_url: true,
                description: true,
                slug: true,
            },
        });

        return {
            is_success: isDeleted ? true : false,
        };
    }
}
