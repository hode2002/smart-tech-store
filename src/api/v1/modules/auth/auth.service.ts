import { InjectQueue } from '@nestjs/bull';
import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { AuthType } from '@prisma/client';
import axios from 'axios';
import * as bcrypt from 'bcrypt';
import { Queue } from 'bull';
import { Request, Response } from 'express';
import { Model } from 'mongoose';
import * as otpGenerator from 'otp-generator';

import { JwtPayload } from '@/common/types';
import { CreateUserDto } from '@v1/modules/user/dto';
import { UserService } from '@v1/modules/user/user.service';

import { CreateUserEmailDto, EmailVerificationDto, ThirdPartyLoginDto } from './dto';
import { Otp } from './model/schema.model';

@Injectable()
export class AuthService {
    constructor(
        @InjectQueue('send-mail')
        private readonly queue: Queue,
        @InjectModel(Otp.name)
        private readonly otpModel: Model<Otp>,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    private createTokenPairs({ email, role, userId }: JwtPayload) {
        const accessToken = this.jwtService.sign(
            { email, role, userId },
            {
                secret: this.configService.get('ACCESS_TOKEN_SECRET'),
                expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES_IN'),
            },
        );

        const refreshToken = this.jwtService.sign(
            { email, role, userId },
            {
                secret: this.configService.get('REFRESH_TOKEN_SECRET'),
                expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
            },
        );

        return { accessToken, refreshToken };
    }

    private async setTokens(res: Response, tokens: { accessToken: string; refreshToken: string }) {
        res.cookie('accessToken', tokens.accessToken, {
            path: '/',
            httpOnly: false,
            maxAge: 60 * 60 * 1000,
        });
        res.cookie('refreshToken', tokens.refreshToken, {
            path: '/',
            httpOnly: false,
            maxAge: 60 * 60 * 1000,
        });
    }

    private async updateUserRefreshToken(email: string, refreshToken: string) {
        const isUpdated = await this.userService.updateByEmail(email, {
            refresh_token: await bcrypt.hash(refreshToken, 10),
        });
        if (!isUpdated) {
            throw new InternalServerErrorException('Internal Server Error');
        }
        return true;
    }

    async validateTurnstile(req: Request, turnstileToken: string) {
        if (!turnstileToken) {
            throw new BadRequestException('Turnstile token is required');
        }

        const secretKey = this.configService.get<string>('TURNSTILE_SECRET_KEY');
        const verifyUrl = this.configService.get<string>('TURNSTILE_VERIFY_URL');

        const { data } = await axios.post(
            verifyUrl,
            {
                secret: secretKey,
                response: turnstileToken,
                remoteip: req.ip,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        if (!data.success) {
            throw new BadRequestException('Turnstile verification failed');
        }

        return { success: true };
    }

    async thirdPartyLogin(
        res: Response,
        thirdPartyLoginDto: ThirdPartyLoginDto,
        authType: AuthType,
    ) {
        if (!thirdPartyLoginDto?.email) {
            return res.redirect(this.configService.get<string>('FRONTEND_REDIRECT_URL'));
        }

        let user = await this.userService.findByEmail(thirdPartyLoginDto.email);
        if (!user) {
            user = await this.userService.create3rdPartyAuthentication(
                thirdPartyLoginDto,
                authType,
            );
            if (!user) {
                throw new InternalServerErrorException('Internal Server Error');
            }
        }

        const tokens = this.createTokenPairs({
            email: thirdPartyLoginDto.email,
            userId: user.id,
            role: user.role,
        });

        await this.updateUserRefreshToken(thirdPartyLoginDto.email, tokens.refreshToken);
        await this.setTokens(res, tokens);

        return res.redirect(this.configService.get<string>('FRONTEND_REDIRECT_URL'));
    }

    async emailVerification(createUserEmailDto: CreateUserEmailDto) {
        const { email } = createUserEmailDto;
        const response = await fetch(this.configService.get('MAIL_VERIFICATION_URL') + email);
        return (await response.json()) as EmailVerificationDto;
    }

    async register(createUserEmailDto: CreateUserEmailDto) {
        const { email } = createUserEmailDto;

        const isExist = await this.userService.findByEmail(email);
        if (isExist) {
            throw new ConflictException('Email Already Exists');
        }

        const res = await this.emailVerification({ email });
        if (res?.smtpCheck === 'false') {
            throw new ConflictException(`Email doesn't exist`);
        }

        const isCreated = await this.userService.createEmail(createUserEmailDto);
        if (!isCreated) {
            throw new InternalServerErrorException('Internal Server Error');
        }

        return await this.sendOtp(createUserEmailDto.email);
    }

    async activeUserEmail(email: string, otpCode: string) {
        const isVerified = await this.verifyOtp(email, otpCode);
        if (!isVerified) {
            throw new ForbiddenException('Invalid Email');
        }

        const isUpdated = await this.userService.updateByEmail(email, {
            is_active: true,
        });

        return { is_success: isUpdated };
    }

    async resendOtp(email: string) {
        return await this.sendOtp(email);
    }

    async sendOtp(email: string, processName = 'send-otp') {
        const otpCode = otpGenerator.generate(6, {
            specialChars: false,
            digits: true,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
        });

        if (!otpCode) {
            throw new InternalServerErrorException('Internal server error');
        }

        const isCreated = await this.otpModel.create({
            email,
            otpCode: bcrypt.hashSync(otpCode, 10),
        });

        if (!isCreated) {
            throw new InternalServerErrorException('Internal Server Error');
        }

        await this.queue.add(processName, { email, otpCode }, { removeOnComplete: true });

        return { email };
    }

    async verifyOtp(email: string, otpCode: string) {
        const otps = await this.otpModel.find({ email }).lean();
        if (!otps.length) {
            throw new ForbiddenException('Invalid Email Or OTP Code');
        }

        const lastOtpObj = otps[otps.length - 1];
        const isMatches = await bcrypt.compare(otpCode, lastOtpObj.otpCode);

        if (!isMatches) {
            await this.otpModel.updateOne({ email });
            throw new ForbiddenException('Invalid Email Or OTP Code');
        }

        const isDeleted = await this.otpModel.deleteMany({ email });
        if (!isDeleted) {
            throw new InternalServerErrorException('Internal Server Error');
        }

        return { is_success: true };
    }

    async createPassword(createUserDto: CreateUserDto) {
        const { email, password } = createUserDto;

        const isExist = await this.userService.findFirstByFilter({
            where: { email, password: null, is_active: true },
        });
        if (!isExist) {
            throw new ForbiddenException('Access denied');
        }

        const hashPass = await bcrypt.hash(password, 10);
        return await this.userService.updatePassword(email, hashPass);
    }

    async login(createAuthDto: CreateUserDto) {
        const { email, password } = createAuthDto;

        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new ForbiddenException('Incorrect Email or Password');
        }

        const isMatches = await bcrypt.compare(password, user.password);
        if (!isMatches) {
            throw new ForbiddenException('Incorrect Email or Password');
        }

        const tokens = this.createTokenPairs({
            email,
            userId: user.id,
            role: user.role,
        });

        await this.updateUserRefreshToken(email, tokens.refreshToken);

        return {
            profile: {
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                phone: user.phone,
                role: user.role,
            },
            tokens,
        };
    }

    async refreshToken({ email, userId, role }: JwtPayload) {
        const tokens = this.createTokenPairs({ email, userId, role });
        await this.updateUserRefreshToken(email, tokens.refreshToken);
        return tokens;
    }

    async logout({ email }: JwtPayload) {
        const isUpdated = await this.userService.updateByEmail(email, {
            refresh_token: null,
        });
        if (!isUpdated) {
            throw new InternalServerErrorException('Internal Server Error');
        }

        return { is_success: true };
    }
}
