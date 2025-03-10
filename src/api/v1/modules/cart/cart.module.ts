import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';
import { MediaModule } from '@v1/modules/media/media.module';
import { UserService } from '@v1/modules/user/user.service';

import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
    imports: [
        PrismaModule,
        BullModule.registerQueue({
            name: 'send-mail',
        }),
        MediaModule,
    ],
    controllers: [CartController],
    providers: [CartService, UserService],
})
export class CartModule {}
