import { HistorySearch } from '@prisma/client';

import { Pagination } from '@/common/types';
import { CreateHistorySearchDto, CreateHistorySearchListDto } from '@v2/modules/history-search/dto';

export interface IHistorySearchQueryRepository {
    findById(id: string): Promise<HistorySearch>;
    findByUserId(userId: string, page: number, limit: number): Promise<Pagination<HistorySearch>>;
}

export interface IHistorySearchCommandRepository {
    create(userId: string, data: CreateHistorySearchDto): Promise<HistorySearch>;
    createMany(userId: string, data: CreateHistorySearchListDto[]): Promise<void>;
    delete(userId: string, id: string): Promise<boolean>;
}

export interface IHistorySearchRepository
    extends IHistorySearchQueryRepository,
        IHistorySearchCommandRepository {}
