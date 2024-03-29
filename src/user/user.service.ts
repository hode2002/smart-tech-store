import {
    ConflictException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { ChangePasswordDto, UpdateUserAddressDto, UpdateUserDto } from './dto';
import { CreateUserEmailDto, ThirdPartyLoginDto } from 'src/auth/dto';
import * as bcrypt from 'bcrypt';
import * as passwordGenerator from 'generate-password';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { FileUploadDto } from 'src/media/dto';
import { MediaService } from 'src/media/media.service';
import { AuthType } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(
        @InjectQueue('send-mail')
        private readonly queue: Queue,
        private readonly prismaService: PrismaService,
        private readonly mediaService: MediaService,
    ) {}

    async create3rdPartyAuthentication(
        thirdPartyLoginDto: ThirdPartyLoginDto,
        authType: AuthType,
    ) {
        const { email, avatar } = thirdPartyLoginDto;

        const isExist = await this.findByEmail(email);
        if (isExist) {
            throw new ConflictException('Email Already Exists');
        }

        return await this.prismaService.user.create({
            data: {
                email,
                is_active: true,
                avatar,
                auth_type: authType,
            },
        });
    }

    async createEmail(createUserEmailDto: CreateUserEmailDto) {
        const { email } = createUserEmailDto;

        const isExist = await this.findByEmail(email);
        if (isExist) {
            throw new ConflictException('Email Already Exists');
        }

        return await this.prismaService.user.create({
            data: {
                email: createUserEmailDto.email,
            },
        });
    }

    async updatePassword(email: string, password: string) {
        const isExist = await this.prismaService.user.findUnique({
            where: {
                email,
                is_active: true,
            },
        });
        if (!isExist) {
            throw new ForbiddenException('Email Not Found');
        }

        return await this.prismaService.user.update({
            where: { email },
            data: {
                password,
            },
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                phone: true,
            },
        });
    }

    async getProfile(email: string) {
        return await this.prismaService.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                phone: true,
            },
        });
    }

    async changePassword(changePasswordDto: ChangePasswordDto) {
        const { email, newPass, oldPass } = changePasswordDto;

        const user = await this.findByEmail(email);
        if (!user) {
            throw new ForbiddenException('Incorrect Email Or Password');
        }

        const is_matches = await bcrypt.compare(oldPass, user.password);
        if (!is_matches) {
            throw new ForbiddenException('Incorrect Old Password');
        }

        const hashPass = await bcrypt.hash(newPass, 10);

        const isUpdated = await this.updatePassword(email, hashPass);

        return {
            is_success: isUpdated ? true : false,
        };
    }

    async updatedAddress(
        userId: string,
        updateUserAddressDto: UpdateUserAddressDto,
    ) {
        const user = await this.prismaService.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
                address: true,
            },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const upsertData = await this.prismaService.userAddress.upsert({
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
            select: {
                address: true,
                province: true,
                district: true,
                ward: true,
                hamlet: true,
            },
        });

        return {
            is_success: true,
            ...upsertData,
        };
    }

    async updateAvatar(email: string, fileUploadDto: FileUploadDto) {
        const user = await this.findByEmail(email);
        if (!user) {
            throw new ForbiddenException('Access denied');
        }

        const res = await this.mediaService.upload(fileUploadDto);
        if (!res?.is_success) {
            throw new InternalServerErrorException('Internal Server Error');
        }

        const awsKey = res?.key;
        if (!awsKey) {
            throw new InternalServerErrorException('Internal Server Error');
        }

        const isUpdated = await this.updateByEmail(email, {
            avatar: awsKey,
        });
        if (!isUpdated) {
            throw new InternalServerErrorException('Internal Server Error');
        }

        const oldAvatar = user?.avatar;
        if (!oldAvatar.includes('default.jpg')) {
            await this.mediaService.deleteFileS3(oldAvatar);
        }

        return isUpdated;
    }

    async resetPassword({ email }: { email: string }) {
        const user = await this.findByEmail(email);
        if (!user) {
            throw new NotFoundException('Email Not Found');
        }

        const newPass = passwordGenerator.generate({
            length: 10,
            lowercase: true,
            uppercase: true,
            numbers: true,
        });
        if (!newPass) {
            throw new InternalServerErrorException('Internal Server Error');
        }

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

        const hashPass = await bcrypt.hash(newPass, 10);

        const isUpdated = await this.updatePassword(email, hashPass);

        return {
            is_success: isUpdated ? true : false,
        };
    }

    async findAll() {
        return await this.prismaService.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                phone: true,
            },
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

    async updateByEmail(email: string, updateUserDto: UpdateUserDto) {
        return await this.prismaService.user.update({
            where: { email },
            data: { ...updateUserDto },
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                phone: true,
            },
        });
    }
}
