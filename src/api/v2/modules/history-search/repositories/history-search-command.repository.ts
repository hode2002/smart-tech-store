import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { CreateHistorySearchDto, CreateHistorySearchListDto } from '@v2/modules/history-search/dto';
import { IHistorySearchCommandRepository } from '@v2/modules/history-search/interfaces';

@Injectable()
export class HistorySearchCommandRepository implements IHistorySearchCommandRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(userId: string, data: CreateHistorySearchDto) {
        return this.prisma.$transaction(async tx => {
            const searchData = await tx.historySearch.findFirst({
                where: {
                    user_id: userId,
                    search_content: data.content,
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
                        search_content: data.content,
                        user_id: userId,
                    },
                });
            }
        });
    }

    async createMany(userId: string, data: CreateHistorySearchListDto[]) {
        await this.prisma.historySearch.createMany({
            data: data.map(item => ({
                user_id: userId,
                search_content: item.content,
                ...item,
            })),
        });
    }

    async delete(userId: string, id: string) {
        await this.prisma.historySearch.delete({ where: { id, user_id: userId } });
        return true;
    }
}
