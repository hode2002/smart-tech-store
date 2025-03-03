import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { generateSlug } from 'src/utils';

import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { MediaService } from '../media/media.service';

@Injectable()
export class NewsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly mediaService: MediaService,
    ) {}

    async create(createNewsDto: CreateNewsDto, file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('Missing image file');
        }
        const res = await this.mediaService.uploadV2(file, '/news');
        if (!res?.public_id) {
            throw new InternalServerErrorException(res.message);
        }
        const slug = generateSlug(createNewsDto.title);
        const imageUrl = res?.url;
        return await this.prismaService.news.create({
            data: {
                ...createNewsDto,
                slug,
                image: imageUrl,
            },
        });
    }

    async findAll() {
        return await this.prismaService.news.findMany({
            orderBy: {
                created_at: 'desc',
            },
        });
    }

    async findById(id: string) {
        if (!id) {
            throw new BadRequestException('Missing news id');
        }
        const news = await this.prismaService.news.findUnique({
            where: { id },
        });
        if (!news) {
            throw new NotFoundException('News not found');
        }
        return news;
    }

    async findBySlug(slug: string) {
        if (!slug) {
            throw new BadRequestException('Missing slug');
        }
        const news = await this.prismaService.news.findFirst({
            where: { slug },
        });
        if (!news) {
            throw new NotFoundException('News not found');
        }
        return news;
    }

    async update(id: string, updateNewsDto: UpdateNewsDto, file?: Express.Multer.File) {
        if (!id) {
            throw new BadRequestException('Missing news id');
        }
        const news = await this.findById(id);
        let imageUrl = news.image;

        if (file?.size) {
            const res = await this.mediaService.uploadV2(file, '/news');
            if (!res?.public_id) {
                throw new InternalServerErrorException(res.message);
            }
            imageUrl = res.url;
            await this.mediaService.deleteV2(news.image);
        }
        const updated2 = await this.prismaService.news.update({
            where: { id },
            data: { ...updateNewsDto, image: imageUrl },
        });
        return updated2;
    }

    async remove(id: string) {
        if (!id) {
            throw new BadRequestException('Missing news id');
        }
        const news = await this.findById(id);
        const deleted = await this.prismaService.news.delete({
            where: { id },
        });
        const is_success = deleted.id ? true : false;
        if (is_success) {
            await this.mediaService.deleteV2(news.image);
        }
        return { is_success };
    }
}
