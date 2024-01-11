import {
    ConflictException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { ForgetPassDto, UpdateUserDto } from './dto';
import { CreateUserEmailDto } from 'src/auth/dto';
import * as bcrypt from 'bcrypt';
import * as passwordGenerator from 'generate-password';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class UserService {
    constructor(
        @InjectQueue('send-mail')
        private readonly queue: Queue,
        private readonly prismaService: PrismaService,
    ) {}

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

    async changePass(forgetPassDto: ForgetPassDto) {
        const { email, newPass, oldPass } = forgetPassDto;

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

    async resetPass({ email }: { email: string }) {
        const user = await this.findByEmail(email);
        if (!user) {
            throw new NotFoundException('Email Not Found');
        }

        const newPass = passwordGenerator.generate({
            length: 6,
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

    async findById(id: number) {
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

    async remove(email: string) {
        const isSuccess = await this.prismaService.user.delete({
            where: { email },
        });

        return isSuccess ? 1 : 0;
    }
}