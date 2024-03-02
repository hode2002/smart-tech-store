import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [DeliveryController],
    providers: [DeliveryService],
    exports: [DeliveryService],
})
export class DeliveryModule {}
