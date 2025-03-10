import { BullModule } from '@nestjs/bull';
import { CacheInterceptor, CacheModule, CacheStore } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { redisStore } from 'cache-manager-redis-store';

import { AuthModule } from './auth/auth.module';
import { BannerModule } from './banner/banner.module';
import { BrandModule } from './brand/brand.module';
import { CartModule } from './cart/cart.module';
import { CategoryModule } from './category/category.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { DeliveryModule } from './delivery/delivery.module';
import { HealthModule } from './health/health.module';
import { HistorySearchModule } from './history-search/history-search.module';
import { MailModule } from './mail/mail.module';
import { MediaModule } from './media/media.module';
import { NewsModule } from './news/news.module';
import { NotificationModule } from './notification/notification.module';
import { OrderModule } from './order/order.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { UserModule } from './user/user.module';
import { VoucherModule } from './voucher/voucher.module';

import type { RedisClientOptions } from 'redis';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        ThrottlerModule.forRoot([
            {
                ttl: 60000, //60s
                limit: 100,
            },
        ]),
        CacheModule.registerAsync<RedisClientOptions>({
            isGlobal: true,
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const store = await redisStore({
                    url: configService.get('REDIS_URL'),
                    ttl: configService.get('CACHE_TTL'),
                });
                return {
                    store: store as unknown as CacheStore,
                };
            },
            inject: [ConfigService],
        }),
        BullModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                redis: {
                    enableTLSForSentinelMode: false,
                    host: configService.get('REDIS_HOST'),
                    port: configService.get('REDIS_PORT'),
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
        CloudinaryModule,
        NewsModule,
        NotificationModule,
        VoucherModule,
        HealthModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        // {
        //     provide: APP_INTERCEPTOR,
        //     useClass: CacheInterceptor,
        // },
    ],
})
export class AppModule {}
