import {
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';

import { MediaService } from '@/api/v1/modules/media/media.service';
import { generateSlug } from '@/common/utils';
import { CreateBannerDto, UpdateBannerDto } from '@v2/modules/banner/dto';
import { BANNER_REPOSITORY, IBannerRepository } from '@v2/modules/banner/repositories';

@Injectable()
export class BannerService {
    constructor(
        @Inject(BANNER_REPOSITORY)
        private readonly bannerRepo: IBannerRepository,
        private readonly mediaService: MediaService,
    ) {}

    async create(createBannerDto: CreateBannerDto, file: Express.Multer.File) {
        const slug = generateSlug(createBannerDto.title);
        const existingBanner = await this.bannerRepo.findBySlug(slug);

        if (existingBanner) {
            return existingBanner;
        }

        const res = await this.mediaService.uploadV2(file);
        if (!res?.public_id) {
            throw new UnprocessableEntityException(res.message);
        }

        return this.bannerRepo.create(createBannerDto, res.url, slug);
    }

    async findAll(page = 1, limit = 10) {
        return this.bannerRepo.findBanners({ status: 'show' }, page, limit);
    }

    async AdminFindAll(page = 1, limit = 10) {
        return this.bannerRepo.findBanners({}, page, limit);
    }

    async findBySlug(slug: string) {
        const banner = await this.bannerRepo.findBySlug(slug);
        if (!banner) {
            throw new NotFoundException('Banner Not Found');
        }
        return banner;
    }

    async update(id: string, updateBannerDto: UpdateBannerDto, file?: Express.Multer.File) {
        const banner = await this.bannerRepo.findById(id);
        if (!banner) {
            throw new NotFoundException('Banner Not Found');
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

        return this.bannerRepo.update(id, updateBannerDto, imageUrl);
    }

    async remove(id: string) {
        const banner = await this.bannerRepo.findById(id);
        if (!banner) {
            throw new NotFoundException('Banner Not Found');
        }
        const isDeleted = await this.bannerRepo.delete(id);
        await this.mediaService.deleteV2(banner.image);
        return { success: isDeleted };
    }
}
