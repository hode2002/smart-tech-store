import { Module } from '@nestjs/common';

import { BannerController } from '@v2/modules/banner/banner.controller';
import {
    BANNER_COMMAND_REPOSITORY,
    BANNER_MEDIA_DELETE_HANDLER,
    BANNER_MEDIA_UPLOAD_HANDLER,
    BANNER_QUERY_REPOSITORY,
} from '@v2/modules/banner/constants';
import { BannerMediaDeleteHandler, BannerMediaUploadHandler } from '@v2/modules/banner/handlers';
import { BannerCommandRepository } from '@v2/modules/banner/repositories/banner-command.repository';
import { BannerQueryRepository } from '@v2/modules/banner/repositories/banner-query.repository';
import { BannerCommandService } from '@v2/modules/banner/services/banner-command.service';
import { BannerMediaDeleteService } from '@v2/modules/banner/services/banner-media-delete.service';
import { BannerMediaUploadService } from '@v2/modules/banner/services/banner-media-upload.service';
import { BannerQueryService } from '@v2/modules/banner/services/banner-query.service';
import { BannerService } from '@v2/modules/banner/services/banner.service';
import { CacheModule } from '@v2/modules/cache/cache.module';
import { CommonModule } from '@v2/modules/common/common.module';
import { MediaModule } from '@v2/modules/media/media.module';

@Module({
    imports: [CommonModule, MediaModule, CacheModule.register({})],
    controllers: [BannerController],
    providers: [
        {
            provide: BANNER_COMMAND_REPOSITORY,
            useClass: BannerCommandRepository,
        },
        {
            provide: BANNER_QUERY_REPOSITORY,
            useClass: BannerQueryRepository,
        },
        {
            provide: BANNER_MEDIA_DELETE_HANDLER,
            useClass: BannerMediaDeleteHandler,
        },
        {
            provide: BANNER_MEDIA_UPLOAD_HANDLER,
            useClass: BannerMediaUploadHandler,
        },
        BannerCommandService,
        BannerQueryService,
        BannerMediaUploadService,
        BannerMediaDeleteService,
        BannerService,
    ],
})
export class BannerModule {}
