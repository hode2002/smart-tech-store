import { User } from '@prisma/client';

import { Pagination } from '@/common/types';
import { UserProfile, UserWithAddress, UserAddress } from '@/prisma/selectors';
import { UserFindFirstArgs, UserWhereInput } from '@v2/modules/user/types';

export interface IUserQueryService {
    filters(filters: UserFindFirstArgs): Promise<User>;
    findFirst(where: UserWhereInput): Promise<UserProfile>;
    findAll(page: number, limit: number): Promise<Pagination<UserWithAddress>>;
    findById(id: string): Promise<UserProfile>;
    findByEmail(email: string): Promise<UserProfile>;
    getProfile(userId: string): Promise<UserProfile>;
    getProfileWithAddress(userId: string): Promise<UserWithAddress>;
    getAddress(userId: string): Promise<Partial<UserAddress>>;
    findAddress(userId: string): Promise<UserAddress | null>;
}
