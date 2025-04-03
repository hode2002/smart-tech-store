import { User } from '@prisma/client';

import { Pagination } from '@/common/types';
import { UserAddress, UserProfile, UserWithAddress } from '@/prisma/selectors';
import { UserFindFirstArgs, UserWhereInput, UserWhereUniqueInput } from '@v2/modules/user/types';

export interface IUserQueryRepository {
    filters(filters: UserFindFirstArgs): Promise<User>;
    findMany(
        page: number,
        limit: number,
        where?: UserWhereInput,
    ): Promise<Pagination<UserWithAddress>>;
    findUnique<T>(where: UserWhereUniqueInput, select: any): Promise<T>;
    findFirst(where: UserWhereInput): Promise<UserProfile>;
    findAddresses(userId: string): Promise<UserAddress[]>;
}
