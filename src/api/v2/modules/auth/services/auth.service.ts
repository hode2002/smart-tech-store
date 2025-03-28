import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Request, Response } from 'express';

import { IAuthService } from '@v2/modules/auth/interfaces';
import { TokenService } from '@v2/modules/auth/services/token.service';
import { EmailVerification } from '@v2/modules/auth/types';
import { MAIL_SERVICE } from '@v2/modules/mail/constants';
import { IMailService } from '@v2/modules/mail/interfaces';
import { OtpService } from '@v2/modules/otp/services/otp.service';
import { USER_TOKENS } from '@v2/modules/user/constants';
import {
    IUserCommandService,
    IUserPasswordHandler,
    IUserQueryService,
} from '@v2/modules/user/interfaces';

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        private readonly tokenService: TokenService,
        private readonly otpService: OtpService,
        private readonly configService: ConfigService,
        @Inject(MAIL_SERVICE)
        private readonly mailService: IMailService,
        @Inject(USER_TOKENS.SERVICES.USER_QUERY_SERVICE)
        private readonly userQueryService: IUserQueryService,
        @Inject(USER_TOKENS.SERVICES.USER_COMMAND_SERVICE)
        private readonly userCommandService: IUserCommandService,
        @Inject(USER_TOKENS.HANDLERS.USER_PASSWORD_HANDLER)
        private readonly passwordHandler: IUserPasswordHandler,
    ) {}

    async verifyEmail(email: string) {
        const url = this.configService.get<string>('MAIL_VERIFICATION_URL');
        const { data } = await axios.get<EmailVerification>(url + email);
        if (data.smtpCheck === 'false') {
            throw new ConflictException(`Email doesn't exist`);
        }
    }

    async validateUser(email: string, password: string) {
        const user = await this.userQueryService.filters({
            where: { email, is_active: true },
        });
        if (!user) {
            throw new ForbiddenException('Incorrect Email or Password');
        }

        const isMatches = await this.passwordHandler.comparePasswords(password, user.password);
        if (!isMatches) {
            throw new ForbiddenException('Incorrect Email or Password');
        }
        return user;
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

    async register(email: string) {
        const [, existingUser] = await Promise.all([
            this.verifyEmail(email),
            this.userQueryService.findFirst({ email, is_active: false }),
        ]);

        if (existingUser) {
            this.otpService.sendOtp(existingUser);
            return true;
        }

        const newUser = await this.userCommandService.createEmail(email);
        if (!newUser) {
            throw new InternalServerErrorException('Internal Server Error');
        }

        this.otpService.sendOtp(newUser);
        return true;
    }

    async activeEmail(email: string, otpCode: string) {
        const isValid = await this.otpService.validateOtp(email, otpCode);
        if (!isValid) {
            throw new ForbiddenException('Invalid Email or OTP Code');
        }

        await this.userCommandService.updateByEmail(email, {
            is_active: true,
        });

        return true;
    }

    async createPassword(email: string, password: string) {
        const isExistingUser = await this.userQueryService.findFirst({
            email,
            password: null,
            is_active: true,
        });

        if (!isExistingUser) {
            throw new ForbiddenException('User not found');
        }

        const hashedPassword = await this.passwordHandler.hashPassword(password);
        this.userCommandService.updatePassword(email, hashedPassword);

        return true;
    }

    async login(res: Response, email: string, password: string) {
        const user = await this.validateUser(email, password);

        const { accessToken, refreshToken } = this.tokenService.createTokenPairs({
            sub: user.id,
            role: user.role,
        });
        this.tokenService.setTokenToCookie(res, refreshToken);

        return {
            accessToken,
        };
    }

    async logout(req: Request, res: Response) {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return true;
        }
        const accessToken = req.get('Authorization').replace('Bearer', '').trim();

        await Promise.all([
            this.tokenService.setTokenToBlacklist(refreshToken),
            this.tokenService.setTokenToBlacklist(accessToken),
        ]);
        res.clearCookie('refreshToken');

        return true;
    }

    async forgotPassword(email: string) {
        const user = await this.userQueryService.findByEmail(email);
        if (!user) {
            throw new NotFoundException(`Email not found`);
        }

        const newPass = this.passwordHandler.generateRandomPassword();
        const hashedPassword = await this.passwordHandler.hashPassword(newPass);

        const [, isUpdated] = await Promise.all([
            this.mailService.sendNewPassword(user, newPass),
            this.userCommandService.updatePassword(email, hashedPassword),
        ]);

        return !!isUpdated;
    }
}
