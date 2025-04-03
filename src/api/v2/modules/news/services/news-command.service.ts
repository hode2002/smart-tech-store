import { BadRequestException, ConflictException, Inject, Injectable } from '@nestjs/common';

import { generateSlug } from '@/common/utils';
import { CacheService } from '@v2/modules/cache/cache.service';
import { CreateNewsDto, UpdateNewsDto } from '@v2/modules/news/dto';
import { INewsCommandRepository } from '@v2/modules/news/interfaces';
import { NewsMediaDeleteService } from '@v2/modules/news/services/news-media-delete.service';
import { NewsMediaUploadService } from '@v2/modules/news/services/news-media-upload.service';
import { NewsQueryService } from '@v2/modules/news/services/news-query.service';

@Injectable()
export class NewsCommandService {
    constructor(
        @Inject('NEWS_COMMAND_REPOSITORY')
        private readonly commandRepository: INewsCommandRepository,
        private readonly newsQueryService: NewsQueryService,
        private readonly mediaUploadService: NewsMediaUploadService,
        private readonly mediaDeleteService: NewsMediaDeleteService,
        private readonly cacheService: CacheService,
    ) {}

    async create(createNewsDto: CreateNewsDto, file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('Missing image file');
        }

        const slug = generateSlug(createNewsDto.title);
        const existingNews = await this.newsQueryService.findBySlug(slug, true);

        if (existingNews) {
            throw new ConflictException('News Already Exists');
        }

        const { secure_url } = await this.mediaUploadService.uploadImage(file);
        const data = {
            ...createNewsDto,
            thumbnail: secure_url,
            slug,
        };

        await this.cacheService.deleteByPattern('news_*');
        return this.commandRepository.create(data);
    }

    async update(id: string, updateNewsDto: UpdateNewsDto, file: Express.Multer.File) {
        const news = await this.newsQueryService.findById(id);
        let thumbnail = news.thumbnail;

        if (file && file?.size) {
            const { secure_url } = await this.mediaUploadService.updateImage(news.thumbnail, file);
            thumbnail = secure_url;
        }

        const data = {
            ...updateNewsDto,
            thumbnail,
        };

        await Promise.all([
            this.cacheService.del(`news_id_${id}`),
            this.cacheService.del(`news_slug_${news.slug}`),
            this.cacheService.deleteByPattern('news_*'),
        ]);

        return this.commandRepository.update(id, data);
    }

    async delete(id: string) {
        const news = await this.newsQueryService.findById(id);

        await Promise.all([
            this.mediaDeleteService.deleteImage(news.thumbnail),
            this.cacheService.del(`news_id_${id}`),
            this.cacheService.del(`news_slug_${news.slug}`),
            this.cacheService.deleteByPattern('news_*'),
        ]);

        return this.commandRepository.delete(id);
    }
}
