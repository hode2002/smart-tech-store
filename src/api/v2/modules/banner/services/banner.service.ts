import { Injectable } from '@nestjs/common';

import { CreateBannerDto, UpdateBannerDto } from '@v2/modules/banner/dto';
import { BannerCommandService } from '@v2/modules/banner/services/banner-command.service';
import { BannerQueryService } from '@v2/modules/banner/services/banner-query.service';

@Injectable()
export class BannerService {
    constructor(
        private readonly bannerQueryService: BannerQueryService,
        private readonly bannerCommandService: BannerCommandService,
    ) {}

    async create(createBannerDto: CreateBannerDto, file: Express.Multer.File) {
        return this.bannerCommandService.create(createBannerDto, file);
    }

    async findAll(page = 1, limit = 10) {
        return this.bannerQueryService.findAll(page, limit);
    }

    async AdminFindAll(page = 1, limit = 10) {
        return this.bannerQueryService.adminFindAll(page, limit);
    }

    async findBySlug(slug: string) {
        return this.bannerQueryService.findBySlug(slug);
    }

    async findById(id: string) {
        return this.bannerQueryService.findById(id);
    }

    async update(id: string, updateBannerDto: UpdateBannerDto, file?: Express.Multer.File) {
        return this.bannerCommandService.update(id, updateBannerDto, file);
    }

    async delete(id: string) {
        return this.bannerCommandService.delete(id);
    }
}
