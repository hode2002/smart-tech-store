import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BullModule } from '@nestjs/bull';
import { MediaModule } from 'src/media/media.module';
import { UserService } from 'src/user/user.service';
import { ProductService } from 'src/product/product.service';

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
