import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateBannerDto, UpdateBannerDto } from './dto';
import { PrismaService } from './../prisma/prisma.service';
import slugify from 'slugify';

@Injectable()
export class BannerService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(createBannerDto: CreateBannerDto) {
        const slug = slugify(createBannerDto.title, {
            replacement: '-',
            remove: undefined,
            lower: true,
            strict: false,
            locale: 'vi',
            trim: true,
        });

        const isExist = await this.findBySlug(slug);
        if (isExist) {
            throw new ConflictException('Banner Already Exists');
        }

        return await this.prismaService.banner.create({
            data: {
                ...createBannerDto,
                slug,
            },
            select: {
                id: true,
                title: true,
                image: true,
                link: true,
                slug: true,
            },
        });
    }

    async findAll() {
        return await this.prismaService.banner.findMany({
            select: {
                id: true,
                title: true,
                image: true,
                link: true,
                slug: true,
            },
        });
    }

    async findBySlug(slug: string) {
        return await this.prismaService.banner.findFirst({
            where: { slug },
            select: {
                id: true,
                title: true,
                image: true,
                link: true,
                slug: true,
            },
        });
    }

    async findById(id: number) {
        const banner = await this.prismaService.banner.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                image: true,
                link: true,
                slug: true,
            },
        });
        if (!banner) {
            throw new NotFoundException('Banner Not Found');
        }

        return banner;
    }

    async update(id: number, updateBannerDto: UpdateBannerDto) {
        const banner = this.findById(id);
        if (!banner) {
            throw new NotFoundException('Banner Not Found');
        }

        return await this.prismaService.banner.update({
            where: { id },
            data: updateBannerDto,
            select: {
                id: true,
                title: true,
                image: true,
                link: true,
                slug: true,
            },
        });
    }

    async remove(id: number) {
        const isExist = await this.findById(id);
        if (!isExist) {
            throw new NotFoundException('Banner Not Found');
        }

        return await this.prismaService.banner.delete({
            where: { id },
            select: {
                id: true,
                title: true,
                image: true,
                link: true,
                slug: true,
            },
        });
    }
}
