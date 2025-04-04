import { Injectable } from '@nestjs/common';
import { ComboStatus } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';
import { COMBO_DETAIL_SELECT, ComboDetail } from '@/prisma/selectors';
import { IComboCommandRepository } from '@v2/modules/product/interfaces';
import { ComboCreateInput, ComboUpdateInput } from '@v2/modules/product/types';

@Injectable()
export class ComboCommandRepository implements IComboCommandRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(comboCreateInput: ComboCreateInput): Promise<ComboDetail> {
        return this.prisma.combo.create({
            data: {
                ...comboCreateInput,
                status: ComboStatus.ACTIVE,
            },
            select: COMBO_DETAIL_SELECT,
        });
    }

    async update(comboId: string, comboUpdateInput: ComboUpdateInput): Promise<ComboDetail> {
        return this.prisma.combo.update({
            where: { id: comboId },
            data: comboUpdateInput,
            select: COMBO_DETAIL_SELECT,
        });
    }

    async softDelete(comboId: string): Promise<boolean> {
        return this.updateStatus(comboId, ComboStatus.INACTIVE);
    }

    async restore(comboId: string): Promise<boolean> {
        return this.updateStatus(comboId, ComboStatus.ACTIVE);
    }

    private async updateStatus(comboId: string, status: ComboStatus): Promise<boolean> {
        const result = await this.prisma.combo.update({
            where: { id: comboId },
            data: { status },
            select: { id: true },
        });

        return !!result;
    }
}
