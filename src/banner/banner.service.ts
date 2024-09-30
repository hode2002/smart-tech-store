import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { CreateBannerDto, UpdateBannerDto } from './dto';
import { PrismaService } from './../prisma/prisma.service';
import { MediaService } from 'src/media/media.service';
import { generateSlug } from 'src/utils';

@Injectable()
export class BannerService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly mediaService: MediaService,
    ) {}

    async create(createBannerDto: CreateBannerDto, file: Express.Multer.File) {
        const slug = generateSlug(createBannerDto.title);

        const banner = await this.findBySlug(slug);
        if (banner) {
            throw new ConflictException('Banner Already Exists');
        }

        const res = await this.mediaService.uploadV2(file);
        if (!res?.public_id) {
            throw new InternalServerErrorException(res.message);
        }

        const imageUrl = res?.url;
        return await this.prismaService.banner.create({
            data: {
                ...createBannerDto,
                image: imageUrl,
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
        file?: Express.Multer.File,
    ) {
        const banner = await this.prismaService.banner.findUnique({
            where: { id },
        });
        if (!banner) {
            throw new NotFoundException('Banner not found');
        }

        let imageUrl = banner.image;

        if (file?.size) {
            const res = await this.mediaService.uploadV2(file);
            if (!res?.public_id) {
                throw new InternalServerErrorException(res.message);
            }
            imageUrl = res.url;
            await this.mediaService.deleteV2(banner.image);
        }

        return await this.prismaService.banner.update({
            where: { id },
            data: {
                ...updateBannerDto,
                image: imageUrl,
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

        await this.mediaService.deleteV2(isExist.image);
        const isDeleted = await this.prismaService.banner.delete({
            where: { id },
        });

        return {
            is_success: isDeleted ? true : false,
        };
    }
}
