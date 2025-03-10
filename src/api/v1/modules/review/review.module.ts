import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ProductService } from '@v1/modules/product/product.service';

import { PrismaModule } from '@/prisma/prisma.module';
import { MediaModule } from '@v1/modules/media/media.module';
import { UserService } from '@v1/modules/user/user.service';

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
