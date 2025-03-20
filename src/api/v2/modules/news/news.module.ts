import { Module } from '@nestjs/common';

import { CacheModule } from '@v2/modules/cache/cache.module';
import { CacheService } from '@v2/modules/cache/cache.service';
import { CommonModule } from '@v2/modules/common/common.module';
import { CommonService } from '@v2/modules/common/common.service';
import { MediaModule } from '@v2/modules/media/media.module';
import {
    NEWS_COMMAND_REPOSITORY,
    NEWS_MEDIA_DELETE_HANDLER,
    NEWS_MEDIA_UPLOAD_HANDLER,
    NEWS_QUERY_REPOSITORY,
} from '@v2/modules/news/constants';
import { NewsMediaDeleteHandler, NewsMediaUploadHandler } from '@v2/modules/news/handlers';
import { INewsCommandRepository } from '@v2/modules/news/interfaces';
import { NewsController } from '@v2/modules/news/news.controller';
import { NewsCommandRepository, NewsQueryRepository } from '@v2/modules/news/repositories';
import {
    NewsCommandService,
    NewsMediaDeleteService,
    NewsMediaUploadService,
    NewsQueryService,
} from '@v2/modules/news/services';

@Module({
    imports: [CommonModule, MediaModule, CacheModule],
    controllers: [NewsController],
    providers: [
        CommonService,
        CacheService,
        {
            provide: NEWS_COMMAND_REPOSITORY,
            useClass: NewsCommandRepository,
        },
        {
            provide: NEWS_QUERY_REPOSITORY,
            useClass: NewsQueryRepository,
        },
        {
            provide: NEWS_MEDIA_UPLOAD_HANDLER,
            useClass: NewsMediaUploadHandler,
        },
        {
            provide: NEWS_MEDIA_DELETE_HANDLER,
            useClass: NewsMediaDeleteHandler,
        },
        {
            provide: NewsCommandService,
            useFactory: (
                commandRepository: INewsCommandRepository,
                newsQueryService: NewsQueryService,
                mediaUploadService: NewsMediaUploadService,
                mediaDeleteService: NewsMediaDeleteService,
                cacheService: CacheService,
            ) => {
                return new NewsCommandService(
                    commandRepository,
                    newsQueryService,
                    mediaUploadService,
                    mediaDeleteService,
                    cacheService,
                );
            },
            inject: [
                NEWS_COMMAND_REPOSITORY,
                NewsQueryService,
                NewsMediaUploadService,
                NewsMediaDeleteService,
                CacheService,
            ],
        },
        NewsMediaDeleteService,
        NewsMediaUploadService,
        NewsQueryService,
    ],
})
export class NewsModule {}
