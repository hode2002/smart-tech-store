import { Inject, Injectable } from '@nestjs/common';
import { Delivery } from '@prisma/client';

import { Pagination } from '@/common/types';
import { CacheService } from '@v2/modules/cache/cache.service';
import { CommonService } from '@v2/modules/common/common.service';
import { DELIVERY_QUERY_REPOSITORY } from '@v2/modules/delivery/constants';
import { IDeliveryQueryRepository } from '@v2/modules/delivery/interfaces';
import { DeliveryWhereInput } from '@v2/modules/delivery/types';

@Injectable()
export class DeliveryQueryService {
    constructor(
        private readonly cacheService: CacheService,
        @Inject(DELIVERY_QUERY_REPOSITORY)
        private readonly deliveryQueryRepository: IDeliveryQueryRepository,
        private readonly commonService: CommonService,
    ) {}

    async findAll(page = 1, limit = 10, where?: DeliveryWhereInput): Promise<Pagination<Delivery>> {
        const cacheKey = `deliveries_${page}_${limit}`;

        const cachedData = await this.cacheService.get<Pagination<Delivery>>(cacheKey);
        if (cachedData) {
            return cachedData;
        }

        const result = await this.deliveryQueryRepository.findAll(page, limit, where);
        await this.cacheService.set(cacheKey, result);

        return result;
    }

    async findById(id: string, where?: DeliveryWhereInput, passthrough = false): Promise<Delivery> {
        const cacheKey = `delivery_id_${id}`;
        const cachedData = await this.cacheService.get<Delivery>(cacheKey);

        if (cachedData) {
            return this.commonService.checkNotFound(cachedData, 'Delivery not found');
        }

        const result = await this.deliveryQueryRepository.findById(id, where);

        if (result) {
            await this.cacheService.set(cacheKey, result);
        }

        if (passthrough) {
            return result;
        }
        return this.commonService.checkNotFound(result, 'Delivery not found');
    }

    async findBySlug(
        slug: string,
        where?: DeliveryWhereInput,
        passthrough = false,
    ): Promise<Delivery> {
        const cacheKey = `delivery_slug_${slug}`;
        const cachedData = await this.cacheService.get<Delivery>(cacheKey);

        if (cachedData) {
            return this.commonService.checkNotFound(cachedData, 'Delivery not found');
        }

        const result = await this.deliveryQueryRepository.findBySlug(slug, where);

        if (result) {
            await this.cacheService.set(cacheKey, result);
        }

        if (passthrough) {
            return result;
        }
        return this.commonService.checkNotFound(result, 'Delivery not found');
    }
}
