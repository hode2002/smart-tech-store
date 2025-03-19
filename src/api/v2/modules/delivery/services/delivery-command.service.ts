import { ConflictException, Inject, Injectable } from '@nestjs/common';

import { CacheService } from '@/api/v2/modules/cache/cache.service';
import { generateSlug } from '@/common/utils';
import { DELIVERY_COMMAND_REPOSITORY } from '@v2/modules/delivery/constants';
import { CreateDeliveryDto, UpdateDeliveryDto } from '@v2/modules/delivery/dto';
import { IDeliveryCommandRepository } from '@v2/modules/delivery/interfaces';
import { DeliveryQueryService } from '@v2/modules/delivery/services';

@Injectable()
export class DeliveryCommandService {
    constructor(
        private readonly cacheService: CacheService,
        @Inject(DELIVERY_COMMAND_REPOSITORY)
        private readonly commandRepository: IDeliveryCommandRepository,
        private readonly deliveryQueryService: DeliveryQueryService,
    ) {}

    async create(createDeliveryDto: CreateDeliveryDto) {
        const slug = generateSlug(createDeliveryDto.name);

        const existingCategory = await this.deliveryQueryService.findBySlug(slug, {}, true);
        if (existingCategory) {
            throw new ConflictException('Category Already Exists');
        }

        await this.cacheService.deleteByPattern('deliveries_*');

        const data = {
            ...createDeliveryDto,
            slug,
        };
        return this.commandRepository.create(data);
    }

    async update(id: string, updateDeliveryDto: UpdateDeliveryDto) {
        const delivery = await this.deliveryQueryService.findById(id);
        const result = await this.commandRepository.update(id, updateDeliveryDto);

        await Promise.all([
            this.cacheService.del(`delivery_id_${id}`),
            this.cacheService.del(`delivery_slug_${delivery.slug}`),
            this.cacheService.deleteByPattern('deliveries_*'),
        ]);

        return result;
    }

    async softDelete(id: string) {
        const delivery = await this.deliveryQueryService.findById(id, { status: 0 });
        const result = await this.commandRepository.softDelete(id);

        await Promise.all([
            this.cacheService.del(`delivery_id_${id}`),
            this.cacheService.del(`delivery_slug_${delivery.slug}`),
            this.cacheService.deleteByPattern('deliveries_*'),
        ]);

        return result;
    }

    async permanentlyDelete(id: string) {
        const delivery = await this.deliveryQueryService.findById(id);
        const result = await this.commandRepository.permanentlyDelete(id);

        await Promise.all([
            this.cacheService.del(`delivery_id_${id}`),
            this.cacheService.del(`delivery_slug_${delivery.slug}`),
            this.cacheService.deleteByPattern('deliveries_*'),
        ]);

        return result;
    }

    async restore(id: string) {
        const delivery = await this.deliveryQueryService.findById(id, { status: 1 }, true);
        const result = await this.commandRepository.update(id, { status: 0 });

        await Promise.all([
            this.cacheService.del(`delivery_id_${id}`),
            this.cacheService.del(`delivery_slug_${delivery.slug}`),
            this.cacheService.deleteByPattern('deliveries_*'),
        ]);

        return result;
    }
}
