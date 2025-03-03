import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { MediaModule } from 'src/media/media.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from 'src/user/user.service';

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
