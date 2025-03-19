import { Module } from '@nestjs/common';

import { CacheService } from '@/api/v2/modules/cache/cache.service';
import { CacheModule } from '@v2/modules/cache/cache.module';
import { CommonModule } from '@v2/modules/common/common.module';
import { CommonService } from '@v2/modules/common/common.service';
import {
    DELIVERY_COMMAND_REPOSITORY,
    DELIVERY_QUERY_REPOSITORY,
} from '@v2/modules/delivery/constants';
import { DeliveryController } from '@v2/modules/delivery/delivery.controller';
import { IDeliveryCommandRepository } from '@v2/modules/delivery/interfaces';
import {
    DeliveryCommandRepository,
    DeliveryQueryRepository,
} from '@v2/modules/delivery/repositories';
import {
    DeliveryCommandService,
    DeliveryQueryService,
    DeliveryService,
} from '@v2/modules/delivery/services';

@Module({
    imports: [CommonModule, CacheModule],
    controllers: [DeliveryController],
    providers: [
        CommonService,
        {
            provide: DELIVERY_QUERY_REPOSITORY,
            useClass: DeliveryQueryRepository,
        },
        {
            provide: DELIVERY_COMMAND_REPOSITORY,
            useClass: DeliveryCommandRepository,
        },
        DeliveryService,
        DeliveryQueryService,
        {
            provide: DeliveryCommandService,
            useFactory: (
                cacheService: CacheService,
                deliveryCommandRepo: IDeliveryCommandRepository,
                deliveryQueryService: DeliveryQueryService,
            ) => {
                return new DeliveryCommandService(
                    cacheService,
                    deliveryCommandRepo,
                    deliveryQueryService,
                );
            },
            inject: [CacheService, DELIVERY_COMMAND_REPOSITORY, DeliveryQueryService],
        },
    ],
    exports: [DeliveryService, DeliveryQueryService, DeliveryCommandService],
})
export class DeliveryModule {}
