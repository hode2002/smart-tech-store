import { Module } from '@nestjs/common';

import { CommonModule } from '@v2/modules/common/common.module';
import {
    HISTORY_SEARCH_COMMAND_REPOSITORY,
    HISTORY_SEARCH_QUERY_REPOSITORY,
} from '@v2/modules/history-search/constants';
import { HistorySearchController } from '@v2/modules/history-search/history-search.controller';
import {
    HistorySearchCommandRepository,
    HistorySearchQueryRepository,
} from '@v2/modules/history-search/repositories';
import {
    HistorySearchCommandService,
    HistorySearchQueryService,
} from '@v2/modules/history-search/services';
import { MediaModule } from '@v2/modules/media/media.module';
import { UserModule } from '@v2/modules/user/user.module';

@Module({
    imports: [CommonModule, UserModule, MediaModule],
    controllers: [HistorySearchController],
    providers: [
        {
            provide: HISTORY_SEARCH_COMMAND_REPOSITORY,
            useClass: HistorySearchCommandRepository,
        },
        {
            provide: HISTORY_SEARCH_QUERY_REPOSITORY,
            useClass: HistorySearchQueryRepository,
        },
        HistorySearchCommandService,
        HistorySearchQueryService,
    ],
    exports: [HistorySearchCommandService, HistorySearchQueryService],
})
export class HistorySearchModule {}
