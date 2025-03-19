import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) {}

    async get<T>(key: string): Promise<T | null> {
        return this.cacheManager.get<T>(key);
    }

    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        await this.cacheManager.set(key, value, ttl);
    }

    async del(key: string): Promise<void> {
        await this.cacheManager.del(key);
    }

    async reset(): Promise<void> {
        await this.cacheManager.reset();
    }

    async getKeys(pattern: string): Promise<string[]> {
        return this.cacheManager.store.keys(pattern);
    }

    async deleteByPattern(pattern: string): Promise<void> {
        const keys = await this.getKeys(pattern);
        await Promise.all(keys.map(key => this.del(key)));
    }
}
