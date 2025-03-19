import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { cacheConfig } from '@/config/cache.config';

import { CacheService } from './cache.service';

@Module({
    imports: [NestCacheModule.registerAsync(cacheConfig)],
    providers: [CacheService],
    exports: [CacheService],
})
export class CacheModule {}
