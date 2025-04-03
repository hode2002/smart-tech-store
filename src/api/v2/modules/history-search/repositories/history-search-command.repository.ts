import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { CreateHistorySearchDto } from '@v2/modules/history-search/dto';
import { IHistorySearchCommandRepository } from '@v2/modules/history-search/interfaces';

@Injectable()
export class HistorySearchCommandRepository implements IHistorySearchCommandRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(userId: string, data: CreateHistorySearchDto) {
        return this.prisma.$transaction(async tx => {
            const searchData = await tx.historySearch.findFirst({
                where: {
                    user_id: userId,
                    content: data.content,
                },
                select: { id: true },
            });

            if (searchData) {
                return tx.historySearch.update({
                    where: { id: searchData.id },
                    data: { updated_at: new Date() },
                });
            } else {
                return tx.historySearch.create({
                    data: {
                        content: data.content,
                        user_id: userId,
                    },
                });
            }
        });
    }

    async delete(userId: string, id: string) {
        await this.prisma.historySearch.delete({ where: { id, user_id: userId } });
        return true;
    }
}
