import { Inject, Injectable } from '@nestjs/common';

import { HISTORY_SEARCH_QUERY_REPOSITORY } from '@v2/modules/history-search/constants';
import { IHistorySearchQueryRepository } from '@v2/modules/history-search/interfaces';

@Injectable()
export class HistorySearchQueryService {
    constructor(
        @Inject(HISTORY_SEARCH_QUERY_REPOSITORY)
        private readonly queryRepository: IHistorySearchQueryRepository,
    ) {}

    async findById(id: string) {
        return this.queryRepository.findById(id);
    }

    async findByUserId(userId: string, page = 1, limit = 10) {
        return this.queryRepository.findByUserId(userId, page, limit);
    }
}
