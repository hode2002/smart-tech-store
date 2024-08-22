import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { CreateBannerDto, UpdateBannerDto } from './dto';
import { PrismaService } from './../prisma/prisma.service';
import { FileUploadDto } from 'src/media/dto';
import { MediaService } from 'src/media/media.service';
import { generateSlug } from 'src/utils';

@Injectable()
export class BannerService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly mediaService: MediaService,
    ) {}

    async create(
        createBannerDto: CreateBannerDto,
        fileUploadDto: FileUploadDto,
    ) {
        const slug = generateSlug(createBannerDto.title);

        const banner = await this.findBySlug(slug);
        if (banner) {
            throw new ConflictException('Banner Already Exists');
        }

        const res = await this.mediaService.upload(fileUploadDto);
        if (!res?.is_success) {
            throw new InternalServerErrorException('Internal Server Error');
        }

        const awsKey = res?.key;
        if (!awsKey) {
            throw new InternalServerErrorException('Internal Server Error');
        }

        return await this.prismaService.banner.create({
            data: {
                ...createBannerDto,
                image: awsKey,
                slug,
            },
            select: {
                id: true,
                title: true,
                image: true,
                link: true,
                slug: true,
                status: true,
                type: true,
                created_at: true,
                updated_at: true,
            },
        });
    }

    async findAll() {
        return await this.prismaService.banner.findMany({
            where: {
                status: 'show',
            },
            orderBy: {
                created_at: 'asc',
            },
            select: {
                id: true,
                title: true,
                image: true,
                link: true,
                slug: true,
                status: true,
                type: true,
            },
        });
    }

    async AdminFindAll() {
        return await this.prismaService.banner.findMany({
            select: {
                id: true,
                title: true,
                image: true,
                link: true,
                slug: true,
                status: true,
                type: true,
                created_at: true,
                updated_at: true,
            },
        });
    }

    async findBySlug(slug: string) {
        return await this.prismaService.banner.findFirst({
            where: { slug, status: 'show' },
            select: {
                id: true,
                title: true,
                image: true,
                link: true,
                slug: true,
                status: true,
                type: true,
            },
        });
    }

    async findById(id: string) {
        const banner = await this.prismaService.banner.findUnique({
            where: { id, status: 'show' },
            select: {
                id: true,
                title: true,
                image: true,
                link: true,
                slug: true,
                type: true,
            },
        });
        if (!banner) {
            throw new NotFoundException('Banner Not Found');
        }

        return banner;
    }

    async update(
        id: string,
        updateBannerDto: UpdateBannerDto,
        fileUploadDto?: FileUploadDto,
    ) {
        const banner = await this.prismaService.banner.findUnique({
            where: { id },
        });
        if (!banner) {
            throw new NotFoundException('Banner not found');
        }

        let awsKey = banner.image;

        if (fileUploadDto?.size) {
            const res = await this.mediaService.upload(fileUploadDto);
            if (!res?.is_success) {
                throw new InternalServerErrorException('Internal Server Error');
            }
            awsKey = res?.key;
            await this.mediaService.deleteFileS3(banner.image);
        }

        if (!awsKey) {
            throw new InternalServerErrorException('Internal Server Error');
        }

        return await this.prismaService.banner.update({
            where: { id },
            data: {
                ...updateBannerDto,
                image: awsKey,
            },
            select: {
                id: true,
                title: true,
                image: true,
                link: true,
                slug: true,
                type: true,
                status: true,
            },
        });
    }

    async remove(id: string) {
        const isExist = await this.prismaService.banner.findUnique({
            where: { id },
        });
        if (!isExist) {
            throw new NotFoundException('Banner Not Found');
        }

        await this.mediaService.deleteFileS3(isExist.image);
        const isDeleted = await this.prismaService.banner.delete({
            where: { id },
        });

        return {
            is_success: isDeleted ? true : false,
        };
    }
}
