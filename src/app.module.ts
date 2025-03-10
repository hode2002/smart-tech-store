import { BullModule } from '@nestjs/bull';
import { CacheInterceptor, CacheModule, CacheStore } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { redisStore } from 'cache-manager-redis-store';

import {
    AuthModule,
    BannerModule,
    BrandModule,
    CartModule,
    CategoryModule,
    CloudinaryModule,
    DeliveryModule,
    HealthModule,
    HistorySearchModule,
    MailModule,
    MediaModule,
    NewsModule,
    NotificationModule,
    OrderModule,
    PrismaModule,
    ProductModule,
    ReviewModule,
    UserModule,
    VoucherModule,
} from '@v1/modules';

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
