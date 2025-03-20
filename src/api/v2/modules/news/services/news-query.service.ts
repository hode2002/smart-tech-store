import { Inject, Injectable } from '@nestjs/common';
import { News } from '@prisma/client';

import { Pagination } from '@/common/types';
import { CacheService } from '@v2/modules/cache/cache.service';
import { CommonService } from '@v2/modules/common/common.service';
import { NEWS_QUERY_REPOSITORY } from '@v2/modules/news/constants';
import { INewsQueryRepository } from '@v2/modules/news/interfaces';

@Injectable()
export class NewsQueryService {
    constructor(
        @Inject(NEWS_QUERY_REPOSITORY)
        private readonly queryRepository: INewsQueryRepository,
        private readonly commonService: CommonService,
        private readonly cacheService: CacheService,
    ) {}

    async findById(id: string, passthrough = false) {
        const cacheKey = `news_id_${id}`;
        const cacheData = await this.cacheService.get<News>(cacheKey);
        if (cacheData) {
            return cacheData;
        }

        const news = await this.queryRepository.findById(id);
        if (news) {
            await this.cacheService.set(cacheKey, news);
        }

        if (passthrough) {
            return news;
        }
        return this.commonService.checkNotFound(news, 'News not found');
    }

    async findBySlug(slug: string, passthrough = false) {
        const cacheKey = `news_slug_${slug}`;
        const cacheData = await this.cacheService.get<News>(cacheKey);
        if (cacheData) {
            return cacheData;
        }

        const news = await this.queryRepository.findBySlug(slug);
        if (news) {
            await this.cacheService.set(cacheKey, news);
        }

        if (passthrough) {
            return news;
        }
        return this.commonService.checkNotFound(news, 'News not found');
    }

    async findAll(page = 1, limit = 10) {
        const cacheKey = `news_${page}_limit_${limit}`;
        const cacheData = await this.cacheService.get<Pagination<News>>(cacheKey);
        if (cacheData) {
            return cacheData;
        }

        const result = await this.queryRepository.findAll(page, limit);
        await this.cacheService.set(cacheKey, result);
        return result;
    }
}
