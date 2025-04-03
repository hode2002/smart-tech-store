import {
    Inject,
    Injectable,
    ConflictException,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthProvider, Role, UserStatus } from '@prisma/client';

import { UserAddress, UserProfile } from '@/prisma/selectors';
import { FacebookProfile, GoogleProfile } from '@v2/modules/auth/types';
import { CacheService } from '@v2/modules/cache/cache.service';
import { USER_TOKENS } from '@v2/modules/user/constants';
import {
    ChangePasswordDto,
    UpdateUserAddressDto,
    UpdateUserDto,
    UpdateUserStatusDto,
} from '@v2/modules/user/dto';
import {
    IUserCommandRepository,
    IUserCommandService,
    IUserMediaService,
    IUserQueryService,
    IUserPasswordHandler,
} from '@v2/modules/user/interfaces';

@Injectable()
export class UserCommandService implements IUserCommandService {
    constructor(
        private readonly cacheService: CacheService,
        private readonly configService: ConfigService,
        @Inject(USER_TOKENS.REPOSITORIES.USER_COMMAND_REPOSITORY)
        private readonly userCommandRepository: IUserCommandRepository,
        @Inject(USER_TOKENS.SERVICES.USER_QUERY_SERVICE)
        private readonly userQueryService: IUserQueryService,
        @Inject(USER_TOKENS.SERVICES.USER_MEDIA_SERVICE)
        private readonly userMediaService: IUserMediaService,
        @Inject(USER_TOKENS.HANDLERS.USER_PASSWORD_HANDLER)
        private readonly passwordHandler: IUserPasswordHandler,
    ) {}

    async create(
        data: GoogleProfile | FacebookProfile,
        provider: AuthProvider,
    ): Promise<UserProfile> {
        return this.userCommandRepository.create({
            status: UserStatus.PENDING,
            auth_provider: provider,
            avatar: this.configService.get('DEFAULT_AVATAR'),
            ...data,
        });
    }

    async createEmail(email: string): Promise<UserProfile> {
        const existingEmail = await this.userQueryService.findByEmail(email);
        if (existingEmail) {
            throw new ConflictException('Email Already Exists');
        }

        return this.userCommandRepository.create({
            email,
            auth_provider: AuthProvider.EMAIL,
            avatar_url: this.configService.get('DEFAULT_AVATAR'),
        });
    }

    async updateStatusByEmail(updateUserStatusDto: UpdateUserStatusDto): Promise<UserProfile> {
        const { email, status } = updateUserStatusDto;
        const user = await this.userCommandRepository.update(
            {
                email,
                NOT: { role: Role.ADMIN },
            },
            { status },
        );

        await Promise.all([
            this.cacheService.deleteByPattern(`user_${user.id}_*`),
            this.cacheService.deleteByPattern('users_*'),
        ]);

        return user;
    }

    async updatePassword(email: string, password: string): Promise<UserProfile> {
        const user = await this.userQueryService.findByEmail(email);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return await this.userCommandRepository.update({ email }, { password });
    }

    async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
        const { newPass, oldPass } = changePasswordDto;

        const user = await this.userQueryService.filters({ where: { id: userId } });
        if (!user || !user.password) {
            throw new ForbiddenException('Incorrect Email Or Password');
        }

        const isMatches = await this.passwordHandler.comparePasswords(oldPass, user.password);
        if (!isMatches) {
            throw new ForbiddenException('Incorrect Old Password');
        }

        const hashPass = await this.passwordHandler.hashPassword(newPass);
        const isUpdated = await this.updatePassword(user.email, hashPass);

        return !!isUpdated;
    }

    async updatedAddress(
        userId: string,
        updateUserAddressDto: UpdateUserAddressDto,
    ): Promise<UserAddress> {
        const user = await this.userQueryService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        await Promise.all([
            this.cacheService.deleteByPattern(`user_${user.id}_*`),
            this.cacheService.deleteByPattern('users_*'),
        ]);

        const userAddress = await this.userQueryService.findAddress(userId);
        if (!userAddress) {
            throw new NotFoundException('User address not found');
        }

        return this.userCommandRepository.updateAddress(
            {
                id: userAddress.id,
            },
            updateUserAddressDto,
        );
    }

    async updateByEmail(email: string, updateUserDto: UpdateUserDto): Promise<UserProfile> {
        const user = await this.userCommandRepository.update({ email }, { ...updateUserDto });
        await Promise.all([
            this.cacheService.deleteByPattern(`user_${user.id}_*`),
            this.cacheService.deleteByPattern('users_*'),
        ]);
        return user;
    }

    async updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<UserProfile> {
        const user = await this.userCommandRepository.update({ id: userId }, { ...updateUserDto });
        await Promise.all([
            this.cacheService.deleteByPattern(`user_${user.id}_*`),
            this.cacheService.deleteByPattern('users_*'),
        ]);
        return user;
    }

    async updateAvatar(userId: string, file: Express.Multer.File): Promise<UserProfile> {
        const user = await this.userQueryService.findById(userId);
        let avatar_url = user.avatar_url;

        if (file && file?.size) {
            const { secure_url } = await this.userMediaService.updateAvatar(user.avatar_url, file);
            avatar_url = secure_url;
        }

        await Promise.all([
            this.cacheService.deleteByPattern(`user_${user.id}_*`),
            this.cacheService.deleteByPattern('users_*'),
        ]);

        return this.userCommandRepository.update({ id: userId }, { avatar_url });
    }
}
