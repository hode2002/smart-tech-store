import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { UserService } from 'src/user/user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BullModule } from '@nestjs/bull';
import { MediaModule } from 'src/media/media.module';

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
