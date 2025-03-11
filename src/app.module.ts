import { BullModule } from '@nestjs/bull';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import {
    authConfig,
    bullConfig,
    cacheConfig,
    mailConfig,
    mongooseConfig,
    throttlerConfig,
} from '@/config';
import {
    AuthModule,
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
import { OtpModule, BannerModule } from '@v2/modules';

@Module({
    imports: [
        ConfigModule.forRoot({ load: [authConfig, mailConfig], isGlobal: true }),
        CacheModule.registerAsync(cacheConfig),
        BullModule.forRootAsync(bullConfig),
        MongooseModule.forRootAsync(mongooseConfig),
        ThrottlerModule.forRoot([throttlerConfig]),
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
        OtpModule,
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
