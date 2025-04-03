import { Module } from '@nestjs/common';

import { CommonModule } from '@v2/modules/common/common.module';
import { ORDER_TOKENS } from '@v2/modules/order/constants';
import { OrderModule } from '@v2/modules/order/order.module';
import { OrderQueryService } from '@v2/modules/order/services/order-query.service';
import { VOUCHER_TOKENS } from '@v2/modules/voucher/constants';
import { VoucherCommandRepository, VoucherQueryRepository } from '@v2/modules/voucher/repositories';
import { VoucherCommandService } from '@v2/modules/voucher/services/voucher-command.service';
import { VoucherQueryService } from '@v2/modules/voucher/services/voucher-query.service';
import { VoucherController } from '@v2/modules/voucher/voucher.controller';

@Module({
    imports: [CommonModule, OrderModule],
    controllers: [VoucherController],
    providers: [
        {
            provide: ORDER_TOKENS.SERVICES.QUERY,
            useClass: OrderQueryService,
        },
        {
            provide: VOUCHER_TOKENS.REPOSITORIES.VOUCHER_QUERY_REPOSITORY,
            useClass: VoucherQueryRepository,
        },
        {
            provide: VOUCHER_TOKENS.REPOSITORIES.VOUCHER_COMMAND_REPOSITORY,
            useClass: VoucherCommandRepository,
        },
        {
            provide: VOUCHER_TOKENS.SERVICES.VOUCHER_QUERY_SERVICE,
            useClass: VoucherQueryService,
        },
        {
            provide: VOUCHER_TOKENS.SERVICES.VOUCHER_COMMAND_SERVICE,
            useClass: VoucherCommandService,
        },
    ],
    exports: [
        VOUCHER_TOKENS.SERVICES.VOUCHER_QUERY_SERVICE,
        VOUCHER_TOKENS.SERVICES.VOUCHER_COMMAND_SERVICE,
        VOUCHER_TOKENS.SERVICES.VOUCHER_COMMAND_SERVICE,
    ],
})
export class VoucherModule {}
