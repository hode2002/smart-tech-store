import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { CreateBrandDto, UpdateBrandDto } from './dto';
import { PrismaService } from './../prisma/prisma.service';
import { FileUploadDto } from 'src/media/dto';
import { MediaService } from 'src/media/media.service';
import { generateSlug } from 'src/utils';

@Injectable()
export class BrandService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly mediaService: MediaService,
    ) {}

    async create(createBrandDto: CreateBrandDto, fileUploadDto: FileUploadDto) {
        const slug = generateSlug(createBrandDto.name);

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
        });
    }

    async findAll() {
        return await this.prismaService.brand.findMany({
            where: {
                is_deleted: false,
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

    async adminFindAll() {
        return await this.prismaService.brand.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                logo_url: true,
                slug: true,
                is_deleted: true,
                created_at: true,
                updated_at: true,
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

    async findById(id: string) {
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
        id: string,
        updateBrandDto: UpdateBrandDto,
        fileUploadDto: FileUploadDto,
    ) {
        const brand = await this.findById(id);
        let logo_url = brand.logo_url;

        if (fileUploadDto) {
            const res = await this.mediaService.upload(fileUploadDto);
            if (!res?.is_success) {
                throw new InternalServerErrorException('Internal Server Error');
            }
            const awsKey = res?.key;
            if (!awsKey) {
                throw new InternalServerErrorException('Internal Server Error');
            }
            logo_url = awsKey;
        }

        await this.mediaService.deleteFileS3(brand.logo_url);

        return await this.prismaService.brand.update({
            where: { id },
            data: {
                ...updateBrandDto,
                logo_url,
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
