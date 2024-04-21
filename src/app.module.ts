import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { BullModule } from '@nestjs/bull';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandModule } from './brand/brand.module';
import { BannerModule } from './banner/banner.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { MediaModule } from './media/media.module';
import { HistorySearchModule } from './history-search/history-search.module';
import { CartModule } from './cart/cart.module';
import { DeliveryModule } from './delivery/delivery.module';
import { OrderModule } from './order/order.module';
import { ReviewModule } from './review/review.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        ThrottlerModule.forRoot([
            {
                ttl: 60000, //60s
                limit: 100,
            },
        ]),
        BullModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                redis: {
                    host: configService.get('REDIS_HOST'),
                    port: configService.get('REDIS_PORT'),
                    username: configService.get('REDIS_USERNAME'),
                    password: configService.get('REDIS_PASSWORD'),
                },
            }),
        }),
        MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get('MONGODB_URL'),
            }),
        }),
        PrismaModule,
        AuthModule,
        UserModule,
        MailModule,
        BrandModule,
        BannerModule,
        CategoryModule,
        ProductModule,
        MediaModule,
        HistorySearchModule,
        CartModule,
        DeliveryModule,
        OrderModule,
        ReviewModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule {}
