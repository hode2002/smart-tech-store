import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';

import { ResponseMessage } from '@/common/decorators';
import { TokenService } from '@v2/modules/auth/services';
import { AuthService } from '@v2/modules/auth/services/auth.service';
import { SocialAuthService } from '@v2/modules/auth/services/social.auth.service';
import { CreateUserDto } from '@v2/modules/user/dto';

import { CreateUserEmailDto, VerifyOtpDto } from './dtos';
import { AtJwtGuard, FacebookGuard, GoogleGuard, RfJwtGuard } from './guards';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly tokenService: TokenService,
        private readonly authService: AuthService,
        private readonly socialAuthService: SocialAuthService,
    ) {}

    @Post('email-verification')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Email verify Success')
    async emailVerification(@Body() createUserEmailDto: CreateUserEmailDto) {
        return this.authService.verifyEmail(createUserEmailDto.email);
    }

    @Get('facebook')
    @UseGuards(FacebookGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Redirect to facebook login')
    async facebookLogin() {
        return { success: true };
    }

    @Get('facebook/redirect')
    @UseGuards(FacebookGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Login with facebook successfully')
    async facebookLoginRedirect(@Req() req: Request, @Res() res: Response) {
        return this.socialAuthService.facebookLogin(req, res);
    }

    @Get('google')
    @UseGuards(GoogleGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Redirect to google login')
    async googleLogin() {
        return { success: true };
    }

    @Get('google/redirect')
    @UseGuards(GoogleGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Login with facebook successfully')
    async googleLoginRedirect(@Req() req: Request, @Res() res: Response) {
        return this.socialAuthService.googleLogin(req, res);
    }

    @Post('register')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @ResponseMessage('Send otp successfully')
    async register(@Body() createUserEmailDto: CreateUserEmailDto) {
        return this.authService.register(createUserEmailDto.email);
    }

    @Post('otp/resend')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @ResponseMessage('Send otp successfully')
    async resendOtp(@Body() createUserEmailDto: CreateUserEmailDto) {
        return this.authService.register(createUserEmailDto.email);
    }

    @Post('active-user-email')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @ResponseMessage('Active User Email Success')
    async activeUserEmail(@Body() verifyOtpDto: VerifyOtpDto) {
        return this.authService.activeEmail(verifyOtpDto.email, verifyOtpDto.otpCode);
    }

    @Post('create-password')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @ResponseMessage('Create Password Success')
    async createPassword(@Body() createUserDto: CreateUserDto) {
        return this.authService.createPassword(createUserDto.email, createUserDto.password);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Login Success')
    async login(@Res({ passthrough: true }) res: Response, @Body() createUserDto: CreateUserDto) {
        return this.authService.login(res, createUserDto.email, createUserDto.password);
    }

    @Post('token/refresh')
    @UseGuards(RfJwtGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Refresh token successfully')
    async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        return this.tokenService.refreshToken(req, res);
    }

    @Post('logout')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Logged out Successfully')
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        return this.authService.logout(req, res);
    }

    @Post('forgot-password')
    @ResponseMessage('Send new password success')
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Body() createUserEmailDto: CreateUserEmailDto) {
        return await this.authService.forgotPassword(createUserEmailDto.email);
    }
}
