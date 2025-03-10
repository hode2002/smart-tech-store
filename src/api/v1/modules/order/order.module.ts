import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from '@/prisma/prisma.module';
import { MediaModule } from '@v1/modules/media/media.module';
import { UserService } from '@v1/modules/user/user.service';
import { VoucherService } from '@v1/modules/voucher/voucher.service';

import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
    imports: [
        PrismaModule,
        BullModule.registerQueue({
            name: 'send-mail',
        }),
        MediaModule,
        ConfigModule,
        HttpModule,
    ],
    controllers: [OrderController],
    providers: [OrderService, UserService, VoucherService],
    exports: [OrderService],
})
export class OrderModule {}
