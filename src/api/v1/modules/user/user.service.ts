import { InjectQueue } from '@nestjs/bull';
import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthType, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Queue } from 'bull';
import * as passwordGenerator from 'generate-password';

import { PrismaService } from '@/prisma/prisma.service';
import {
    USER_ADDRESS_SELECT,
    USER_PROFILE_SELECT,
    USER_SELECT_FIELDS,
    USER_WITH_ADDRESS_SELECT,
    UserAddress,
    UserBasicInfo,
    UserProfile,
    UserWithAddress,
} from '@/prisma/selectors';
import { CreateUserEmailDto, ThirdPartyLoginDto } from '@v1/modules/auth/dto';
import { MediaService } from '@v1/modules/media/media.service';

import { ChangePasswordDto, UpdateUserAddressDto, UpdateUserDto, UpdateUserStatusDto } from './dto';

@Injectable()
export class UserService {
    private readonly SALT_ROUNDS = 10;
    private readonly DEFAULT_AVATAR: string;

    constructor(
        @InjectQueue('send-mail')
        private readonly queue: Queue,
        private readonly configService: ConfigService,
        private readonly prismaService: PrismaService,
        private readonly mediaService: MediaService,
    ) {
        this.DEFAULT_AVATAR = this.configService.get('DEFAULT_AVATAR');
    }

    async create3rdPartyAuthentication(thirdPartyLoginDto: ThirdPartyLoginDto, authType: AuthType) {
        const { email, avatar } = thirdPartyLoginDto;

        await this.checkEmailExists(email);

        return await this.prismaService.user.create({
            data: {
                email,
                is_active: true,
                avatar,
                auth_type: authType,
            },
        });
    }

    async updateStatusByEmail(updateUserStatusDto: UpdateUserStatusDto): Promise<UserWithAddress> {
        const { email, is_active } = updateUserStatusDto;

        try {
            return await this.prismaService.user.update({
                where: {
                    email,
                    NOT: {
                        role: Role.ADMIN,
                    },
                },
                data: { is_active },
                select: USER_WITH_ADDRESS_SELECT,
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`User with email ${email} not found or is an admin`);
            }
            throw error;
        }
    }

    async createEmail(createUserEmailDto: CreateUserEmailDto) {
        const { email } = createUserEmailDto;

        await this.checkEmailExists(email);

        return await this.prismaService.user.create({
            data: {
                email,
            },
        });
    }

    async updatePassword(email: string, password: string): Promise<UserBasicInfo> {
        // Kiểm tra người dùng tồn tại và đang hoạt động
        await this.findActiveUserByEmail(email);

        return await this.prismaService.user.update({
            where: { email },
            data: { password },
            select: USER_SELECT_FIELDS,
        });
    }

    async getAll(): Promise<UserWithAddress[]> {
        return await this.prismaService.user.findMany({
            where: {
                NOT: { role: Role.ADMIN },
            },
            select: USER_WITH_ADDRESS_SELECT,
        });
    }

    async getProfile(email: string): Promise<UserProfile | null> {
        return await this.prismaService.user.findUnique({
            where: { email },
            select: USER_PROFILE_SELECT,
        });
    }

    async getAddress(email: string): Promise<Partial<UserAddress>> {
        const userAddress = await this.prismaService.user.findUnique({
            where: { email },
            select: {
                address: {
                    select: {
                        address: true,
                        province: true,
                        district: true,
                        ward: true,
                    },
                },
            },
        });

        if (!userAddress || !userAddress.address) {
            return {};
        }

        return { ...userAddress.address };
    }

    async changePassword(email: string, changePasswordDto: ChangePasswordDto) {
        const { newPass, oldPass } = changePasswordDto;

        const user = await this.findByEmail(email);
        if (!user || !user.password) {
            throw new ForbiddenException('Incorrect Email Or Password');
        }

        const isMatches = await bcrypt.compare(oldPass, user.password);
        if (!isMatches) {
            throw new ForbiddenException('Incorrect Old Password');
        }

        const hashPass = await this.hashPassword(newPass);
        const isUpdated = await this.updatePassword(email, hashPass);

        return {
            is_success: !!isUpdated,
        };
    }

    async updatedAddress(
        userId: string,
        updateUserAddressDto: UpdateUserAddressDto,
    ): Promise<UserAddress> {
        const user = await this.prismaService.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
                address: true,
            },
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        return await this.prismaService.userAddress.upsert({
            where: {
                user_id: userId,
            },
            create: {
                user_id: userId,
                ...updateUserAddressDto,
            },
            update: {
                ...updateUserAddressDto,
            },
            select: USER_ADDRESS_SELECT,
        });
    }

    async updateAvatar(email: string, file: Express.Multer.File): Promise<UserBasicInfo> {
        if (!file) {
            throw new BadRequestException('Missing avatar file');
        }

        const user = await this.findByEmail(email);
        if (!user) {
            throw new ForbiddenException('Access denied');
        }

        const result = await this.mediaService.uploadV2(file, '/Avatars');

        if (!result?.public_id) {
            throw new InternalServerErrorException(result.message || 'Failed to upload avatar');
        }

        // Xóa avatar cũ nếu không phải avatar mặc định
        const oldAvatar = user?.avatar;
        if (oldAvatar && !oldAvatar.includes(this.DEFAULT_AVATAR)) {
            await this.mediaService.deleteV2(oldAvatar).catch(error => {
                console.error('Failed to delete old avatar:', error);
            });
        }

        const isUpdated = await this.updateByEmail(email, {
            avatar: result.url,
        });

        if (!isUpdated) {
            throw new InternalServerErrorException('Failed to update avatar');
        }

        return isUpdated;
    }

    async resetPassword({ email }: { email: string }) {
        const user = await this.findByEmail(email);
        if (!user) {
            throw new NotFoundException(`Email ${email} not found`);
        }

        const newPass = this.generateRandomPassword();
        const hashPass = await this.hashPassword(newPass);

        await this.queue.add(
            'send-new-pass',
            {
                email,
                newPass,
            },
            {
                removeOnComplete: true,
            },
        );

        const isUpdated = await this.updatePassword(email, hashPass);

        return {
            is_success: !!isUpdated,
        };
    }

    async findAll(): Promise<UserBasicInfo[]> {
        return await this.prismaService.user.findMany({
            select: USER_SELECT_FIELDS,
        });
    }

    async findFirstByFilter(filter: object) {
        return await this.prismaService.user.findFirst(filter);
    }

    async findByEmail(email: string) {
        return await this.prismaService.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string) {
        return await this.prismaService.user.findUnique({
            where: { id },
        });
    }

    async updateByEmail(email: string, updateUserDto: UpdateUserDto): Promise<UserBasicInfo> {
        try {
            return await this.prismaService.user.update({
                where: { email },
                data: { ...updateUserDto },
                select: USER_SELECT_FIELDS,
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`User with email ${email} not found`);
            }
            throw error;
        }
    }

    // Helper methods
    private async checkEmailExists(email: string): Promise<void> {
        const isExist = await this.findByEmail(email);
        if (isExist) {
            throw new ConflictException('Email Already Exists');
        }
    }

    private async findActiveUserByEmail(email: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email,
                is_active: true,
            },
        });

        if (!user) {
            throw new ForbiddenException('Email Not Found or User is Inactive');
        }

        return user;
    }

    private async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, this.SALT_ROUNDS);
    }

    private generateRandomPassword(): string {
        const password = passwordGenerator.generate({
            length: 10,
            lowercase: true,
            uppercase: true,
            numbers: true,
            strict: true,
        });

        if (!password) {
            throw new InternalServerErrorException('Failed to generate password');
        }

        return password;
    }
}
