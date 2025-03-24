import { Injectable } from '@nestjs/common';

import { formatPagination } from '@/common/helpers';
import { PrismaService } from '@/prisma/prisma.service';
import { HISTORY_SEARCH_FULL_SELECT } from '@/prisma/selectors/history-search';
import { IHistorySearchQueryRepository } from '@v2/modules/history-search/interfaces';

@Injectable()
export class HistorySearchQueryRepository implements IHistorySearchQueryRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findById(id: string) {
        return this.prisma.historySearch.findUnique({
            where: { id },
            select: HISTORY_SEARCH_FULL_SELECT,
        });
    }

    async findByUserId(userId: string, page: number, limit: number) {
        const skip = (page - 1) * limit;
        const [searchData, total] = await Promise.all([
            this.prisma.historySearch.findMany({
                where: { user_id: userId },
                skip,
                take: limit,
                orderBy: { updated_at: 'desc' },
                select: HISTORY_SEARCH_FULL_SELECT,
            }),
            this.prisma.historySearch.count({
                where: { user_id: userId },
            }),
        ]);
        return formatPagination({ searchData }, total, page, limit);
    }
}
