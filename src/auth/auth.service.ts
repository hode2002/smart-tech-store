import {
    ConflictException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto';
import {
    CreateUserEmailDto,
    EmailVerificationDto,
    ThirdPartyLoginDto,
} from './dto';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import * as otpGenerator from 'otp-generator';
import { Otp } from './model/schema.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/common/types';
import { AuthType } from '@prisma/client';

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

    async thirdPartyLogin(
        thirdPartyLoginDto: ThirdPartyLoginDto,
        authType: AuthType,
    ) {
        const { email } = thirdPartyLoginDto;

        let user = await this.userService.findByEmail(email);
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
            email,
            userId: user.id,
            role: user.role,
        });

        const isUpdated = await this.userService.updateByEmail(email, {
            refresh_token: await bcrypt.hash(tokens.refresh_Token, 10),
        });
        if (!isUpdated) {
            throw new InternalServerErrorException('Internal Server Error');
        }

        return tokens;
    }

    async emailVerification(createUserEmailDto: CreateUserEmailDto) {
        const { email } = createUserEmailDto;

        const response = await fetch(
            this.configService.get('MAIL_VERIFICATION_URL') + email,
        );

        const data = (await response.json()) as EmailVerificationDto;
        return {
            email_available: data.smtpCheck,
        };
    }

    async register(createUserEmailDto: CreateUserEmailDto) {
        const { email } = createUserEmailDto;

        const isExist = await this.userService.findByEmail(email);
        if (isExist) {
            throw new ConflictException('Email Already Exists');
        }

        const isCreated =
            await this.userService.createEmail(createUserEmailDto);
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

        return {
            is_success: isUpdated ? true : false,
        };
    }

    async resendOtp(email: string) {
        return await this.sendOtp(email);
    }

    async sendOtp(email: string, processName: string = 'send-otp') {
        const otpCode = otpGenerator.generate(6, {
            specialChars: false,
            digits: true,
            upperCaseAlphabets: true,
            lowerCaseAlphabets: true,
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

        await this.queue.add(
            processName,
            {
                email,
                otpCode,
            },
            {
                removeOnComplete: true,
            },
        );

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
            this.otpModel.updateOne({
                email,
            });
            throw new ForbiddenException('Invalid Email Or OTP Code');
        }

        const isDeleted = await this.otpModel.deleteMany({ email });
        if (!isDeleted) {
            throw new InternalServerErrorException('Internal Server Error');
        }

        return {
            is_success: true,
        };
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

        const isUpdated = await this.userService.updateByEmail(email, {
            refresh_token: await bcrypt.hash(tokens.refresh_Token, 10),
        });
        if (!isUpdated) {
            throw new InternalServerErrorException('Internal Server Error');
        }

        return tokens;
    }

    async refreshToken({ email, userId, role }: JwtPayload) {
        const tokens = this.createTokenPairs({ email, userId, role });

        const isUpdated = await this.userService.updateByEmail(email, {
            refresh_token: await bcrypt.hash(tokens.refresh_Token, 10),
        });
        if (!isUpdated) {
            throw new InternalServerErrorException('Internal Server Error');
        }

        return tokens;
    }

    async logout({ email }: JwtPayload) {
        const isUpdated = await this.userService.updateByEmail(email, {
            refresh_token: null,
        });
        if (!isUpdated) {
            throw new InternalServerErrorException('Internal Server Error');
        }

        return {
            is_success: true,
        };
    }

    createTokenPairs({ email, role, userId }: JwtPayload) {
        const accessToken = this.jwtService.sign(
            { email, role, userId },
            {
                secret: this.configService.get('ACCESS_TOKEN_SECRET'),
                expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES_IN'),
            },
        );

        const refresh_Token = this.jwtService.sign(
            { email, role, userId },
            {
                secret: this.configService.get('REFRESH_TOKEN_SECRET'),
                expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
            },
        );

        return { accessToken, refresh_Token };
    }
}
