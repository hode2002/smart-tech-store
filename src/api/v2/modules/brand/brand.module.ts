import { Module } from '@nestjs/common';

import { BrandController } from '@v2/modules/brand/brand.controller';
import { BRAND_TOKENS } from '@v2/modules/brand/constants';
import {
    CloudinaryMediaDeleteHandler,
    CloudinaryMediaUploadHandler,
} from '@v2/modules/brand/handlers';
import { BrandCommandRepository, BrandQueryRepository } from '@v2/modules/brand/repositories';
import {
    BrandCommandService,
    BrandQueryService,
    BrandMediaUploadService,
    BrandMediaDeleteService,
    BrandService,
} from '@v2/modules/brand/services';
import { CommonModule } from '@v2/modules/common/common.module';
import { MediaModule } from '@v2/modules/media/media.module';

@Module({
    imports: [CommonModule, MediaModule],
    controllers: [BrandController],
    providers: [
        {
            provide: BRAND_TOKENS.REPOSITORIES.QUERY,
            useClass: BrandQueryRepository,
        },
        {
            provide: BRAND_TOKENS.REPOSITORIES.COMMAND,
            useClass: BrandCommandRepository,
        },
        {
            provide: BRAND_TOKENS.HANDLERS.MEDIA_UPLOAD,
            useClass: CloudinaryMediaUploadHandler,
        },
        {
            provide: BRAND_TOKENS.HANDLERS.MEDIA_DELETE,
            useClass: CloudinaryMediaDeleteHandler,
        },
        {
            provide: BRAND_TOKENS.SERVICES.QUERY,
            useClass: BrandQueryService,
        },
        {
            provide: BRAND_TOKENS.SERVICES.COMMAND,
            useClass: BrandCommandService,
        },
        {
            provide: BRAND_TOKENS.SERVICES.MEDIA_UPLOAD,
            useClass: BrandMediaUploadService,
        },
        {
            provide: BRAND_TOKENS.SERVICES.MEDIA_DELETE,
            useClass: BrandMediaDeleteService,
        },
        {
            provide: BRAND_TOKENS.SERVICES.BRAND,
            useClass: BrandService,
        },
    ],
    exports: [
        BRAND_TOKENS.SERVICES.BRAND,
        BRAND_TOKENS.SERVICES.COMMAND,
        BRAND_TOKENS.SERVICES.QUERY,
        BRAND_TOKENS.SERVICES.MEDIA_UPLOAD,
        BRAND_TOKENS.SERVICES.MEDIA_DELETE,
        BRAND_TOKENS.REPOSITORIES.QUERY,
        BRAND_TOKENS.REPOSITORIES.COMMAND,
        BRAND_TOKENS.HANDLERS.MEDIA_UPLOAD,
        BRAND_TOKENS.HANDLERS.MEDIA_DELETE,
    ],
})
export class BrandModule {}
