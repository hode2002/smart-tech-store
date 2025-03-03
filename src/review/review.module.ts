import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { MediaModule } from 'src/media/media.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductService } from 'src/product/product.service';
import { UserService } from 'src/user/user.service';

import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
    imports: [
        PrismaModule,
        BullModule.registerQueue({
            name: 'send-mail',
        }),
        MediaModule,
    ],
    controllers: [ReviewController],
    providers: [ReviewService, UserService, ProductService],
    exports: [ReviewService],
})
export class ReviewModule {}
