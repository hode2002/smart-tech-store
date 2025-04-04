import { Injectable } from '@nestjs/common';

import { formatPagination } from '@/common/helpers';
import { Pagination } from '@/common/types';
import { PrismaService } from '@/prisma/prisma.service';
import { COMBO_DETAIL_SELECT, ComboDetail } from '@/prisma/selectors';
import { IComboQueryRepository } from '@v2/modules/product/interfaces';
import { ComboWhereInput } from '@v2/modules/product/types';

@Injectable()
export class ComboQueryRepository implements IComboQueryRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findById(id: string): Promise<ComboDetail> {
        return this.prisma.combo.findUnique({
            where: { id },
            select: COMBO_DETAIL_SELECT,
        });
    }

    async findAll(
        page: number,
        limit: number,
        where?: ComboWhereInput,
    ): Promise<Pagination<ComboDetail>> {
        const skip = (page - 1) * limit;
        const take = limit;

        const [combos, total] = await Promise.all([
            this.prisma.combo.findMany({
                where,
                skip,
                take,
                select: COMBO_DETAIL_SELECT,
            }),
            this.prisma.combo.count({ where }),
        ]);

        return formatPagination({ combos }, total, page, limit);
    }

    async findMany(where?: ComboWhereInput): Promise<ComboDetail[]> {
        return this.prisma.combo.findMany({ where, select: COMBO_DETAIL_SELECT });
    }
}
