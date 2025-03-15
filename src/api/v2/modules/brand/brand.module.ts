import { Module } from '@nestjs/common';

import {
    BRAND_COMMAND_REPOSITORY,
    BRAND_MEDIA_UPLOAD_HANDLER,
    BRAND_MEDIA_DELETE_HANDLER,
    BRAND_QUERY_REPOSITORY,
} from '@v2/modules/brand/constants';
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

import { BrandController } from './brand.controller';

@Module({
    imports: [CommonModule, MediaModule],
    controllers: [BrandController],
    providers: [
        {
            provide: BRAND_QUERY_REPOSITORY,
            useClass: BrandQueryRepository,
        },
        {
            provide: BRAND_COMMAND_REPOSITORY,
            useClass: BrandCommandRepository,
        },
        {
            provide: BRAND_MEDIA_UPLOAD_HANDLER,
            useClass: CloudinaryMediaUploadHandler,
        },
        {
            provide: BRAND_MEDIA_DELETE_HANDLER,
            useClass: CloudinaryMediaDeleteHandler,
        },
        BrandMediaUploadService,
        BrandMediaDeleteService,
        BrandService,
        BrandQueryService,
        BrandCommandService,
    ],
})
export class BrandModule {}
