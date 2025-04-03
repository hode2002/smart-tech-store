import { UserAddress, UserProfile } from '@/prisma/selectors';
import {
    UserAddressCreateInput,
    UserAddressUpdateInput,
    UserAddressWhereUniqueInput,
    UserCreateInput,
    UserUpdateInput,
    UserWhereInput,
} from '@v2/modules/user/types';

export interface IUserCommandRepository {
    create(data: UserCreateInput): Promise<UserProfile>;
    update(where: UserWhereInput, data: UserUpdateInput): Promise<UserProfile>;
    updateAddress(
        where: UserAddressWhereUniqueInput,
        update: UserAddressUpdateInput,
    ): Promise<UserAddress>;
    upsertAddress(
        where: UserAddressWhereUniqueInput,
        create: UserAddressCreateInput,
        update: UserAddressUpdateInput,
    ): Promise<UserAddress>;
}
