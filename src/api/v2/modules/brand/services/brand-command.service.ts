import { ConflictException, Inject, Injectable } from '@nestjs/common';

import { generateSlug } from '@/common/utils';
import { BRAND_MEDIA_UPLOAD_HANDLER, BRAND_COMMAND_REPOSITORY } from '@v2/modules/brand/constants';
import { CreateBrandDto, UpdateBrandDto } from '@v2/modules/brand/dto';
import { IBrandCommandRepository, IBrandMediaUploadHandler } from '@v2/modules/brand/interfaces';
import { BrandQueryService } from '@v2/modules/brand/services/brand-query.service';

@Injectable()
export class BrandCommandService {
    constructor(
        @Inject(BRAND_COMMAND_REPOSITORY)
        private readonly brandRepo: IBrandCommandRepository,
        @Inject(BRAND_MEDIA_UPLOAD_HANDLER)
        private readonly mediaHandler: IBrandMediaUploadHandler,
        private readonly brandQueryService: BrandQueryService,
    ) {}

    async create(createBrandDto: CreateBrandDto, file: Express.Multer.File) {
        const slug = generateSlug(createBrandDto.name);

        const existingBrand = await this.brandQueryService.findBySlug(slug, true);
        if (existingBrand) {
            throw new ConflictException('Brand Already Exists');
        }
        const result = await this.mediaHandler.uploadLogo(file);

        const data = {
            logo_url: result.secure_url,
            slug,
            ...createBrandDto,
        };
        return this.brandRepo.create(data);
    }

    async update(id: string, updateBrandDto: UpdateBrandDto, file: Express.Multer.File) {
        const brand = await this.brandQueryService.findById(id);
        let logo_url = brand.logo_url;

        if (file && file?.size) {
            const { secure_url } = await this.mediaHandler.updateLogo(brand.logo_url, file);
            logo_url = secure_url;
        }

        const data = {
            logo_url,
            ...updateBrandDto,
        };
        return this.brandRepo.update(id, data);
    }

    async softDelete(id: string) {
        await this.brandQueryService.findById(id);
        return this.brandRepo.softDelete(id);
    }

    async permanentlyDelete(id: string) {
        await this.brandQueryService.findById(id);
        return this.brandRepo.permanentlyDelete(id);
    }

    async restore(id: string) {
        await this.brandQueryService.findById(id, { is_deleted: true }, true);

        const data = { is_deleted: false };
        return this.brandRepo.update(id, data);
    }
}
