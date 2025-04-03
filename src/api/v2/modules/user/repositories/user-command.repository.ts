import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import {
    USER_ADDRESS_SELECT,
    USER_PROFILE_SELECT,
    UserAddress,
    UserProfile,
} from '@/prisma/selectors';
import { IUserCommandRepository } from '@v2/modules/user/interfaces';
import {
    UserAddressCreateInput,
    UserAddressUpdateInput,
    UserAddressWhereUniqueInput,
    UserCreateInput,
    UserUpdateInput,
    UserWhereUniqueInput,
} from '@v2/modules/user/types';

@Injectable()
export class UserCommandRepository implements IUserCommandRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async create(data: UserCreateInput): Promise<UserProfile> {
        return this.prismaService.user.create({
            data,
            select: USER_PROFILE_SELECT,
        });
    }

    async update(where: UserWhereUniqueInput, data: UserUpdateInput): Promise<UserProfile> {
        return this.prismaService.user.update({
            where,
            data,
            select: USER_PROFILE_SELECT,
        });
    }

    async upsertAddress(
        where: UserAddressWhereUniqueInput,
        create: UserAddressCreateInput,
        update: UserAddressUpdateInput,
    ): Promise<UserAddress> {
        return this.prismaService.userAddress.upsert({
            where,
            create,
            update,
            select: USER_ADDRESS_SELECT,
        });
    }

    async updateAddress(
        where: UserAddressWhereUniqueInput,
        data: UserAddressUpdateInput,
    ): Promise<UserAddress> {
        return this.prismaService.userAddress.update({
            where,
            data,
            select: USER_ADDRESS_SELECT,
        });
    }
}
