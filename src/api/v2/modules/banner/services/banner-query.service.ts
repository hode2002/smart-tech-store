import { Inject, Injectable } from '@nestjs/common';
import { Banner, BannerStatus } from '@prisma/client';

import { Pagination } from '@/common/types';
import { BANNER_QUERY_REPOSITORY } from '@v2/modules/banner/constants';
import { IBannerQueryRepository } from '@v2/modules/banner/interfaces';
import { BannerWhereInput } from '@v2/modules/banner/types';
import { CacheService } from '@v2/modules/cache/cache.service';
import { CommonService } from '@v2/modules/common/common.service';

@Injectable()
export class BannerQueryService {
    constructor(
        @Inject(BANNER_QUERY_REPOSITORY)
        private readonly queryRepository: IBannerQueryRepository,
        private readonly cacheService: CacheService,
        private readonly commonService: CommonService,
    ) {}

    async findAll(page = 1, limit = 10) {
        const cacheKey = `banners_${page}_limit_${limit}`;
        const cacheData = await this.cacheService.get<Pagination<Banner>>(cacheKey);
        if (cacheData) {
            return cacheData;
        }

        const result = await this.queryRepository.findAll(page, limit, {
            status: BannerStatus.ACTIVE,
        });
        await this.cacheService.set(cacheKey, result);
        return result;
    }

    async adminFindAll(page = 1, limit = 10) {
        const cacheKey = `banners_admin_${page}_limit_${limit}`;
        const cacheData = await this.cacheService.get<Pagination<Banner>>(cacheKey);
        if (cacheData) {
            return cacheData;
        }

        const result = await this.queryRepository.findAll(page, limit, {});
        await this.cacheService.set(cacheKey, result);
        return result;
    }

    async findById(id: string, where?: BannerWhereInput, passthrough = false) {
        const cacheKey = `banner_id_${id}`;
        const cacheData = await this.cacheService.get<Banner>(cacheKey);
        if (cacheData) {
            return cacheData;
        }

        const banner = await this.queryRepository.findById(id, where);
        if (banner) {
            await this.cacheService.set(cacheKey, banner);
        }

        if (passthrough) {
            return banner;
        }
        return this.commonService.checkNotFound(banner, 'Banner not found');
    }

    async findBySlug(slug: string, passthrough = false) {
        const cacheKey = `banner_slug_${slug}`;
        const cacheData = await this.cacheService.get<Banner>(cacheKey);
        if (cacheData) {
            return cacheData;
        }

        const banner = await this.queryRepository.findBySlug(slug);
        if (banner) {
            await this.cacheService.set(cacheKey, banner);
        }

        if (passthrough) {
            return banner;
        }
        return this.commonService.checkNotFound(banner, 'Banner not found');
    }
}
