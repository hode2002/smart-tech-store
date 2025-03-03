import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MediaModule } from 'src/media/media.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from 'src/user/user.service';
import { VoucherService } from 'src/voucher/voucher.service';

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
