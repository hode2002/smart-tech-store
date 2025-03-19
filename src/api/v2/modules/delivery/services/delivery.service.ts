import { Injectable } from '@nestjs/common';

import { CreateDeliveryDto, UpdateDeliveryDto } from '@v2/modules/delivery/dto';
import { DeliveryCommandService, DeliveryQueryService } from '@v2/modules/delivery/services';

@Injectable()
export class DeliveryService {
    constructor(
        private readonly deliveryQueryService: DeliveryQueryService,
        private readonly deliveryCommandService: DeliveryCommandService,
    ) {}

    async create(createDeliveryDto: CreateDeliveryDto) {
        return this.deliveryCommandService.create(createDeliveryDto);
    }

    async findAll(page = 1, limit = 10) {
        return this.deliveryQueryService.findAll(page, limit, { status: 0 });
    }

    async adminFindAll(page = 1, limit = 10) {
        return this.deliveryQueryService.findAll(page, limit);
    }

    async findById(id: string) {
        return this.deliveryQueryService.findById(id);
    }

    async findBySlug(slug: string) {
        return this.deliveryQueryService.findBySlug(slug);
    }

    async update(id: string, updateDeliveryDto: UpdateDeliveryDto) {
        return this.deliveryCommandService.update(id, updateDeliveryDto);
    }

    async softDelete(id: string) {
        return this.deliveryCommandService.softDelete(id);
    }

    async permanentlyDelete(id: string) {
        return this.deliveryCommandService.permanentlyDelete(id);
    }

    async restore(id: string) {
        return this.deliveryCommandService.restore(id);
    }
}
