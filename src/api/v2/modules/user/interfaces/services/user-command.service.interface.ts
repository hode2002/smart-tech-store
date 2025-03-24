import { AuthType } from '@prisma/client';

import { UserAddress, UserProfile } from '@/prisma/selectors';
import { FacebookProfile, GoogleProfile } from '@v2/modules/auth/types';
import {
    ChangePasswordDto,
    UpdateUserAddressDto,
    UpdateUserDto,
    UpdateUserStatusDto,
} from '@v2/modules/user/dto';

export interface IUserCreateService {
    create(data: GoogleProfile | FacebookProfile, provider: AuthType): Promise<UserProfile>;
    createEmail(email: string): Promise<UserProfile>;
}

export interface IUserEditService {
    updatePassword(email: string, password: string): Promise<UserProfile>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<boolean>;
    updatedAddress(
        userId: string,
        updateUserAddressDto: UpdateUserAddressDto,
    ): Promise<UserAddress>;
    updateByEmail(email: string, updateUserDto: UpdateUserDto): Promise<UserProfile>;
    updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<UserProfile>;
    updateAvatar(userId: string, file: Express.Multer.File): Promise<UserProfile>;
    updateStatusByEmail(updateUserStatusDto: UpdateUserStatusDto): Promise<UserProfile>;
}

export interface IUserCommandService extends IUserCreateService, IUserEditService {}
