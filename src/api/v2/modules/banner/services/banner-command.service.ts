import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { BannerStatus } from '@prisma/client';

import { generateSlug } from '@/common/utils';
import { BANNER_COMMAND_REPOSITORY } from '@v2/modules/banner/constants';
import { CreateBannerDto, UpdateBannerDto } from '@/api/v2/modules/banner/dto';
import { IBannerCommandRepository } from '@v2/modules/banner/interfaces';
import { BannerMediaDeleteService } from '@v2/modules/banner/services/banner-media-delete.service';
import { BannerMediaUploadService } from '@v2/modules/banner/services/banner-media-upload.service';
import { BannerQueryService } from '@v2/modules/banner/services/banner-query.service';
import { CacheService } from '@v2/modules/cache/cache.service';

@Injectable()
export class BannerCommandService {
    constructor(
        @Inject(BANNER_COMMAND_REPOSITORY)
        private readonly commandRepository: IBannerCommandRepository,
        private readonly bannerQueryService: BannerQueryService,
        private readonly mediaUploadService: BannerMediaUploadService,
        private readonly mediaDeleteService: BannerMediaDeleteService,
        private readonly cacheService: CacheService,
    ) {}

    async create(createBannerDto: CreateBannerDto, file: Express.Multer.File) {
        const slug = generateSlug(createBannerDto.title);
        const existingBanner = await this.bannerQueryService.findBySlug(slug, true);

        if (existingBanner) {
            throw new ConflictException('Banner Already Exists');
        }

        const { secure_url } = await this.mediaUploadService.uploadImage(file);

        const data = {
            ...createBannerDto,
            image: secure_url,
            slug,
        };

        await this.cacheService.deleteByPattern('banners_*');
        return this.commandRepository.create(data);
    }

    async update(id: string, updateBannerDto: UpdateBannerDto, file?: Express.Multer.File) {
        const banner = await this.bannerQueryService.findById(id);
        let image = banner.image_url;

        if (file && file?.size) {
            const { secure_url } = await this.mediaUploadService.updateImage(
                banner.image_url,
                file,
            );
            image = secure_url;
        }

        const data = {
            ...updateBannerDto,
            image,
        };

        await Promise.all([
            this.cacheService.del(`banner_id_${id}`),
            this.cacheService.del(`banner_slug_${banner.slug}`),
            this.cacheService.deleteByPattern('banners_*'),
        ]);
        return this.commandRepository.update(id, data);
    }

    async delete(id: string) {
        const banner = await this.bannerQueryService.findById(id);

        await Promise.all([
            this.mediaDeleteService.deleteImage(banner.image_url),
            this.cacheService.del(`banner_id_${id}`),
            this.cacheService.del(`banner_slug_${banner.slug}`),
            this.cacheService.deleteByPattern('banners_*'),
        ]);

        return this.commandRepository.delete(id);
    }

    async restore(id: string) {
        const banner = await this.bannerQueryService.findById(
            id,
            { status: BannerStatus.INACTIVE },
            true,
        );

        await Promise.all([
            this.cacheService.del(`banner_id_${id}`),
            this.cacheService.del(`banner_slug_${banner.slug}`),
            this.cacheService.deleteByPattern('banners_*'),
        ]);

        const data = { status: BannerStatus.ACTIVE };
        return this.commandRepository.update(id, data);
    }
}
