import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { generateSlug } from '@/common/utils';
import { PrismaService } from '@/prisma/prisma.service';

import { CreateDeliveryDto, UpdateDeliveryDto } from './dto';

@Injectable()
export class DeliveryService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(createDeliveryDto: CreateDeliveryDto) {
        const { name } = createDeliveryDto;

        const delivery = await this.findBySlug(generateSlug(name));
        if (delivery) {
            throw new ConflictException('Delivery service already exists');
        }

        return await this.prismaService.delivery.create({
            data: {
                name,
                slug: generateSlug(name),
            },
            select: {
                id: true,
                name: true,
                slug: true,
            },
        });
    }

    async findAll() {
        return await this.prismaService.delivery.findMany({
            where: { status: 0 },
            select: {
                id: true,
                name: true,
                slug: true,
            },
        });
    }

    async findById(id: string) {
        const delivery = await this.prismaService.delivery.findFirst({
            where: { id, status: 0 },
            take: 1,
            select: {
                id: true,
                name: true,
                slug: true,
            },
        });

        if (!delivery) {
            throw new NotFoundException('Delivery service not found');
        }

        return delivery;
    }

    async adminFindAll() {
        return await this.prismaService.delivery.findMany();
    }

    async findBySlug(slug: string) {
        return await this.prismaService.delivery.findFirst({
            where: { slug, status: 0 },
            take: 1,
            select: {
                id: true,
                name: true,
                slug: true,
            },
        });
    }

    async update(id: string, updateDeliveryDto: UpdateDeliveryDto) {
        const { name } = updateDeliveryDto;

        const delivery = await this.findById(id);
        if (!delivery) {
            throw new NotFoundException('Delivery service not found');
        }

        return await this.prismaService.delivery.update({
            where: { id },
            data: { name },
            select: {
                id: true,
                name: true,
                slug: true,
            },
        });
    }

    async remove(id: string) {
        const delivery = await this.findById(id);
        if (!delivery) {
            throw new NotFoundException('Delivery service not found');
        }

        return await this.prismaService.delivery.update({
            where: { id },
            data: { status: 1 },
        });
    }
}
