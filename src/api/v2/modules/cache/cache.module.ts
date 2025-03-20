import {
    CacheModuleOptions,
    CacheStore,
    CacheModule as NestCacheModule,
} from '@nestjs/cache-manager';
import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

import { CacheService } from '@v2/modules/cache/cache.service';
@Module({})
export class CacheModule {
    static register<StoreConfig extends Record<any, any> = Record<string, any>>(
        options: CacheModuleOptions<StoreConfig>,
    ): DynamicModule {
        return {
            module: CacheModule,
            imports: [
                NestCacheModule.registerAsync({
                    isGlobal: true,
                    imports: [ConfigModule],
                    useFactory: async (
                        configService: ConfigService,
                    ): Promise<CacheModuleOptions> => {
                        const store = await redisStore({
                            url: configService.get<string>('REDIS_URL'),
                            ttl: options.ttl ?? configService.get<number>('CACHE_TTL', 3600),
                        });

                        return {
                            store: store as unknown as CacheStore,
                            ttl: options.ttl ?? configService.get<number>('CACHE_TTL', 3600),
                        };
                    },
                    inject: [ConfigService],
                }),
            ],
            providers: [CacheService],
            exports: [CacheService],
        };
    }
}
