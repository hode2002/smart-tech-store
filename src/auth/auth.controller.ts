import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto';
import { CreateUserEmailDto, VerifyOtpDto } from './dto';
import { Throttle } from '@nestjs/throttler';
import { SuccessResponse } from 'src/common';
import { AtJwtGuard, RfJwtGuard } from './guards';

@Controller('api/v1/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @Throttle({ default: { limit: 3, ttl: 60000 } })
    async register(
        @Body() createUserEmailDto: CreateUserEmailDto,
    ): Promise<SuccessResponse> {
        return {
            code: 201,
            status: 'Success',
            message: 'Send otp successfully',
            data: await this.authService.register(createUserEmailDto),
        };
    }

    @Post('otp/resend')
    @Throttle({ default: { limit: 3, ttl: 60000 } })
    async resendOtp(
        @Body() createUserEmailDto: CreateUserEmailDto,
    ): Promise<SuccessResponse> {
        return {
            code: 201,
            status: 'Success',
            message: 'Send otp successfully',
            data: await this.authService.resendOtp(createUserEmailDto.email),
        };
    }

    @Post('active-user-email')
    @Throttle({ default: { limit: 3, ttl: 60000 } })
    async activeUserEmail(
        @Body() verifyOtpDto: VerifyOtpDto,
    ): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Active User Email Success',
            data: await this.authService.activeUserEmail(
                verifyOtpDto.email,
                verifyOtpDto.otpCode,
            ),
        };
    }

    @Post('create-password')
    @Throttle({ default: { limit: 3, ttl: 60000 } })
    async createPassword(
        @Body() createUserDto: CreateUserDto,
    ): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Create Password Success',
            data: await this.authService.createPassword(createUserDto),
        };
    }

    @Post('login')
    async login(
        @Body() createUserDto: CreateUserDto,
    ): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Login Success',
            data: await this.authService.login(createUserDto),
        };
    }

    @UseGuards(RfJwtGuard)
    @Post('token/refresh')
    async refreshToken(@Req() req: Request): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Refresh Token Success',
            data: await this.authService.refreshToken(req['user']),
        };
    }

    @UseGuards(AtJwtGuard)
    @Post('logout')
    async logout(@Req() req: Request): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Logout Success',
            data: await this.authService.logout(req['user']),
        };
    }
}
