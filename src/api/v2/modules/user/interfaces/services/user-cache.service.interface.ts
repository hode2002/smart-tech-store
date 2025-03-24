import { Pagination } from '@/common/types';
import { UserProfile, UserWithAddress } from '@/prisma/selectors';

export interface IUserCacheService {
    getUserProfile(userId: string): Promise<UserProfile | null>;
    setUserProfile(userId: string, profile: UserProfile): Promise<void>;
    getUserProfileWithAddress(userId: string): Promise<UserWithAddress | null>;
    setUserProfileWithAddress(userId: string, profile: UserWithAddress): Promise<void>;
    getUsersPagination(page: number, limit: number): Promise<Pagination<UserWithAddress> | null>;
    setUsersPagination(
        page: number,
        limit: number,
        users: Pagination<UserWithAddress>,
    ): Promise<void>;
}
