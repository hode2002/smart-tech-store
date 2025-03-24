import { Injectable } from '@nestjs/common';

import { Pagination } from '@/common/types';
import { UserProfile, UserWithAddress } from '@/prisma/selectors';
import { CacheService } from '@v2/modules/cache/cache.service';
import { IUserCacheService } from '@v2/modules/user/interfaces';

@Injectable()
export class UserCacheService implements IUserCacheService {
    constructor(private readonly cacheService: CacheService) {}

    async getUserProfile(userId: string): Promise<UserProfile | null> {
        return this.cacheService.get<UserProfile>(`user_${userId}_profile`);
    }

    async setUserProfile(userId: string, profile: UserProfile): Promise<void> {
        await this.cacheService.set(`user_${userId}_profile`, profile);
    }

    async getUserProfileWithAddress(userId: string): Promise<UserWithAddress | null> {
        return this.cacheService.get<UserWithAddress>(`user_${userId}_profile_address`);
    }

    async setUserProfileWithAddress(userId: string, profile: UserWithAddress): Promise<void> {
        await this.cacheService.set(`user_${userId}_profile_address`, profile);
    }

    async getUsersPagination(
        page: number,
        limit: number,
    ): Promise<Pagination<UserWithAddress> | null> {
        return this.cacheService.get<Pagination<UserWithAddress>>(`users_${page}_${limit}`);
    }

    async setUsersPagination(
        page: number,
        limit: number,
        users: Pagination<UserWithAddress>,
    ): Promise<void> {
        await this.cacheService.set(`users_${page}_${limit}`, users);
    }
}
