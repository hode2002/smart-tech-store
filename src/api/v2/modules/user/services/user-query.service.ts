import { Inject, Injectable } from '@nestjs/common';
import { Role, User } from '@prisma/client';

import { Pagination } from '@/common/types';
import {
    USER_PROFILE_SELECT,
    USER_WITH_ADDRESS_SELECT,
    UserAddress,
    UserProfile,
    UserWithAddress,
} from '@/prisma/selectors';
import { USER_TOKENS } from '@v2/modules/user/constants';
import { IUserQueryRepository, IUserQueryService } from '@v2/modules/user/interfaces';
import { UserCacheService } from '@v2/modules/user/services/user-cache.service';
import { UserFindFirstArgs, UserWhereInput } from '@v2/modules/user/types';

@Injectable()
export class UserQueryService implements IUserQueryService {
    constructor(
        @Inject(USER_TOKENS.REPOSITORIES.USER_QUERY_REPOSITORY)
        private readonly userQueryRepository: IUserQueryRepository,
        private readonly userCacheService: UserCacheService,
    ) {}

    async filters(filters: UserFindFirstArgs): Promise<User> {
        return this.userQueryRepository.filters(filters);
    }

    async findFirst(where: UserWhereInput): Promise<UserProfile> {
        return this.userQueryRepository.findFirst(where);
    }

    async findAll(page: number, limit: number): Promise<Pagination<UserWithAddress>> {
        const cacheData = await this.userCacheService.getUsersPagination(page, limit);
        if (cacheData) {
            return cacheData;
        }

        const users = await this.userQueryRepository.findMany(page, limit, {
            NOT: { role: Role.ADMIN },
        });
        await this.userCacheService.setUsersPagination(page, limit, users);
        return users;
    }

    async findById(id: string): Promise<UserProfile> {
        return this.userQueryRepository.findUnique<UserProfile>({ id }, USER_PROFILE_SELECT);
    }

    async findByEmail(email: string): Promise<UserProfile> {
        return this.userQueryRepository.findUnique<UserProfile>({ email }, USER_PROFILE_SELECT);
    }

    async getProfile(userId: string): Promise<UserProfile> {
        const cacheData = await this.userCacheService.getUserProfile(userId);
        if (cacheData) {
            return cacheData;
        }

        const profile = await this.userQueryRepository.findUnique<UserProfile>(
            { id: userId },
            USER_PROFILE_SELECT,
        );
        await this.userCacheService.setUserProfile(userId, profile);
        return profile;
    }

    async getAddress(userId: string): Promise<UserAddress | null> {
        return this.userQueryRepository.findAddress(userId);
    }

    async getProfileWithAddress(userId: string): Promise<UserWithAddress> {
        const cacheData = await this.userCacheService.getUserProfileWithAddress(userId);
        if (cacheData) {
            return cacheData;
        }

        const profile = await this.userQueryRepository.findUnique<UserWithAddress>(
            { id: userId },
            USER_WITH_ADDRESS_SELECT,
        );
        await this.userCacheService.setUserProfileWithAddress(userId, profile);
        return profile;
    }

    async findAddress(userId: string): Promise<UserAddress | null> {
        return this.userQueryRepository.findAddress(userId);
    }
}
