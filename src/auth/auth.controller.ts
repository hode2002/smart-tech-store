import {
    Controller,
    Post,
    Body,
    UseGuards,
    Req,
    HttpStatus,
    HttpCode,
    Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto';
import { CreateUserEmailDto, VerifyOtpDto } from './dto';
import { Throttle } from '@nestjs/throttler';
import { AtJwtGuard, FacebookGuard, GoogleGuard, RfJwtGuard } from './guards';
import { SuccessResponse } from 'src/common/response';

@Controller('api/v1/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('email-verification')
    async emailVerification(
        @Body() createUserEmailDto: CreateUserEmailDto,
    ): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Email verification',
            data: await this.authService.emailVerification(createUserEmailDto),
        };
    }

    @Get('facebook')
    @UseGuards(FacebookGuard)
    async facebookLogin(): Promise<SuccessResponse> {
        return {
            code: 201,
            status: 'Success',
            message: 'Redirect to facebook login',
        };
    }

    @Get('facebook/redirect')
    @UseGuards(FacebookGuard)
    async facebookLoginRedirect(@Req() req: Request): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Login successfully',
            data: await this.authService.thirdPartyLogin(req['user']),
        };
    }

    @Get('google')
    @UseGuards(GoogleGuard)
    async googleLogin(): Promise<SuccessResponse> {
        return {
            code: 201,
            status: 'Success',
            message: 'Redirect to google login',
        };
    }

    @Get('google/redirect')
    @UseGuards(GoogleGuard)
    async googleLoginRedirect(@Req() req: Request): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Login successfully',
            data: await this.authService.thirdPartyLogin(req['user']),
        };
    }

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
    @HttpCode(HttpStatus.OK)
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
    @HttpCode(HttpStatus.OK)
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
    @HttpCode(HttpStatus.OK)
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

    @Post('token/refresh')
    @UseGuards(RfJwtGuard)
    @HttpCode(HttpStatus.OK)
    async refreshToken(@Req() req: Request): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Refresh Token Success',
            data: await this.authService.refreshToken(req['user']),
        };
    }

    @Post('logout')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async logout(@Req() req: Request): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Logout Success',
            data: await this.authService.logout(req['user']),
        };
    }
}
