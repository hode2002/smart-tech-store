import { CacheModuleOptions, CacheStore } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

export const cacheConfig = {
    isGlobal: true,
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService): Promise<CacheModuleOptions> => {
        const store = await redisStore({
            url: configService.get<string>('REDIS_URL'),
            ttl: configService.get<number>('CACHE_TTL'),
        });

        return {
            store: store as unknown as CacheStore,
        };
    },
    inject: [ConfigService],
};
