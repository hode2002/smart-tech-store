import { Inject, Injectable } from '@nestjs/common';

import { HISTORY_SEARCH_COMMAND_REPOSITORY } from '@v2/modules/history-search/constants';
import { CreateHistorySearchDto } from '@v2/modules/history-search/dto';
import { IHistorySearchCommandRepository } from '@v2/modules/history-search/interfaces';

@Injectable()
export class HistorySearchCommandService {
    constructor(
        @Inject(HISTORY_SEARCH_COMMAND_REPOSITORY)
        private readonly commandRepository: IHistorySearchCommandRepository,
    ) {}

    async create(userId: string, createHistorySearchDto: CreateHistorySearchDto) {
        return this.commandRepository.create(userId, createHistorySearchDto);
    }

    async delete(userId: string, id: string) {
        return this.commandRepository.delete(userId, id);
    }
}
