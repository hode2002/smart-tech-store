import { Injectable } from '@nestjs/common';
import { Delivery } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';
import { CreateDeliveryDto, UpdateDeliveryDto } from '@v2/modules/delivery/dto';
import { IDeliveryCommandRepository } from '@v2/modules/delivery/interfaces';

@Injectable()
export class DeliveryCommandRepository implements IDeliveryCommandRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateDeliveryDto & { slug: string }): Promise<Delivery> {
        return this.prisma.delivery.create({
            data,
        });
    }

    async update(id: string, data: UpdateDeliveryDto): Promise<Delivery> {
        return this.prisma.delivery.update({
            where: { id },
            data,
        });
    }

    async softDelete(id: string): Promise<boolean> {
        await this.prisma.delivery.update({
            where: { id },
            data: { status: 1 },
        });

        return true;
    }

    async permanentlyDelete(id: string): Promise<boolean> {
        await this.prisma.delivery.delete({
            where: { id },
        });

        return true;
    }
}
