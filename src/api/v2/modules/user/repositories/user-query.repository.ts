import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { formatPagination } from '@/common/helpers';
import { Pagination } from '@/common/types';
import { PrismaService } from '@/prisma/prisma.service';
import {
    USER_ADDRESS_SELECT,
    USER_PROFILE_SELECT,
    USER_WITH_ADDRESS_SELECT,
    UserAddress,
    UserProfile,
    UserWithAddress,
} from '@/prisma/selectors';
import { IUserQueryRepository } from '@v2/modules/user/interfaces';
import { UserFindFirstArgs, UserWhereInput, UserWhereUniqueInput } from '@v2/modules/user/types';

@Injectable()
export class UserQueryRepository implements IUserQueryRepository {
    constructor(private readonly prisma: PrismaService) {}

    filters(filters: UserFindFirstArgs): Promise<User> {
        return this.prisma.user.findFirst(filters);
    }

    async findMany(
        page: number,
        limit: number,
        where?: UserWhereInput,
    ): Promise<Pagination<UserWithAddress>> {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'asc' },
                select: USER_WITH_ADDRESS_SELECT,
            }),
            this.prisma.user.count({ where }),
        ]);
        return formatPagination({ users }, total, page, limit);
    }

    async findUnique<T>(where: UserWhereUniqueInput, select: any): Promise<T> {
        return this.prisma.user.findUnique({
            where,
            select,
        }) as T;
    }

    async findFirst(where: UserWhereInput): Promise<UserProfile> {
        return this.prisma.user.findFirst({ where, select: USER_PROFILE_SELECT });
    }

    async findAddress(userId: string): Promise<UserAddress | null> {
        const userAddress = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                address: {
                    select: USER_ADDRESS_SELECT,
                },
            },
        });

        return userAddress.address;
    }
}
