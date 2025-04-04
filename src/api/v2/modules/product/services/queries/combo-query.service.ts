import { Inject, Injectable } from '@nestjs/common';
import { ComboStatus } from '@prisma/client';

import { Pagination } from '@/common/types';
import { ComboDetail } from '@/prisma/selectors';
import { CacheService } from '@v2/modules/cache/cache.service';
import { PRODUCT_TOKENS } from '@v2/modules/product/constants';
import { IComboQueryRepository, IComboQueryService } from '@v2/modules/product/interfaces';

@Injectable()
export class ComboQueryService implements IComboQueryService {
    constructor(
        @Inject(PRODUCT_TOKENS.REPOSITORIES.COMBO_QUERY)
        private readonly queryRepository: IComboQueryRepository,
        private readonly cacheService: CacheService,
    ) {}

    async findById(id: string): Promise<ComboDetail> {
        const cacheKey = `product_combo_${id}`;
        const cachedData = await this.cacheService.get<ComboDetail>(cacheKey);

        if (cachedData) {
            return cachedData;
        }

        const combo = await this.queryRepository.findById(id);
        await this.cacheService.set(cacheKey, combo);

        return combo;
    }

    async findAll(page: number, limit: number): Promise<Pagination<ComboDetail>> {
        const cacheKey = 'all_product_combos';
        const cachedData = await this.cacheService.get<Pagination<ComboDetail>>(cacheKey);

        if (cachedData) {
            return cachedData;
        }

        const combos = await this.queryRepository.findAll(page, limit, {
            status: ComboStatus.ACTIVE,
        });
        await this.cacheService.set(cacheKey, combos);

        return combos;
    }

    async findAllManagement(page: number, limit: number): Promise<Pagination<ComboDetail>> {
        const cacheKey = 'all_product_combos_management';
        const cachedData = await this.cacheService.get<Pagination<ComboDetail>>(cacheKey);

        if (cachedData) {
            return cachedData;
        }

        const combos = await this.queryRepository.findAll(page, limit);
        await this.cacheService.set(cacheKey, combos);

        return combos;
    }
}
