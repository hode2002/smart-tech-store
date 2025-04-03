import { ConflictException, Inject, Injectable } from '@nestjs/common';

import { generateSlug } from '@/common/utils';
import { BRAND_TOKENS } from '@v2/modules/brand/constants';
import { CreateBrandDto, UpdateBrandDto } from '@v2/modules/brand/dto';
import {
    IBrandCommandRepository,
    IBrandMediaUploadHandler,
    IBrandCommandService,
    IBrandQueryService,
} from '@v2/modules/brand/interfaces';

@Injectable()
export class BrandCommandService implements IBrandCommandService {
    constructor(
        @Inject(BRAND_TOKENS.REPOSITORIES.COMMAND)
        private readonly brandRepo: IBrandCommandRepository,
        @Inject(BRAND_TOKENS.HANDLERS.MEDIA_UPLOAD)
        private readonly mediaHandler: IBrandMediaUploadHandler,
        @Inject(BRAND_TOKENS.SERVICES.QUERY)
        private readonly brandQueryService: IBrandQueryService,
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
        await this.brandQueryService.findById(id, { deleted_at: { not: null } });

        const data = { deleted_at: null };
        return this.brandRepo.update(id, data);
    }
}
