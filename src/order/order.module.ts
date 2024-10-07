import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BullModule } from '@nestjs/bull';
import { MediaModule } from 'src/media/media.module';
import { UserService } from 'src/user/user.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { VoucherService } from 'src/voucher/voucher.service';

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
