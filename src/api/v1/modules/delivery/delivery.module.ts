import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';

import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';

@Module({
    imports: [PrismaModule],
    controllers: [DeliveryController],
    providers: [DeliveryService],
    exports: [DeliveryService],
})
export class DeliveryModule {}
