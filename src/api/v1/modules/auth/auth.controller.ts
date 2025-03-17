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
import { JwtPayload } from '@/common/types';
import { CreateUserDto } from '@v1/modules/user/dto';

import { AuthService } from './auth.service';
import { CreateUserEmailDto, ThirdPartyLoginDto, TurnstileTokenDto, VerifyOtpDto } from './dto';
import { AtJwtGuard, FacebookGuard, GoogleGuard, RfJwtGuard } from './guards';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('email-verification')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Email verify Success')
    async emailVerification(@Body() createUserEmailDto: CreateUserEmailDto) {
        return this.authService.emailVerification(createUserEmailDto);
    }

    @Post('validate-turnstile')
    @ResponseMessage('Validate turnstile token successfully')
    @HttpCode(HttpStatus.OK)
    async validateTurnstile(
        @Req() request: Request,
        @Body('turnstileToken') turnstileToken: string,
    ) {
        return this.authService.validateTurnstile(request, turnstileToken);
    }

    @Get('facebook')
    @UseGuards(FacebookGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Redirect to facebook login')
    async facebookLogin() {
        return;
    }

    @Get('facebook/redirect')
    @UseGuards(FacebookGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Login successfully')
    async facebookLoginRedirect(@Req() req: Request, @Res() res: Response) {
        return this.authService.thirdPartyLogin(res, req['user'] as ThirdPartyLoginDto, 'FACEBOOK');
    }

    @Get('google')
    @UseGuards(GoogleGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Redirect to google login')
    async googleLogin() {
        return;
    }

    @Get('google/redirect')
    @UseGuards(GoogleGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Login successfully')
    async googleLoginRedirect(@Req() req: Request, @Res() res: Response) {
        return this.authService.thirdPartyLogin(res, req['user'] as ThirdPartyLoginDto, 'GOOGLE');
    }

    @Post('register')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 3, ttl: 60000 } })
    @ResponseMessage('Send otp successfully')
    async register(@Body() createUserEmailDto: CreateUserEmailDto & TurnstileTokenDto) {
        return this.authService.register(createUserEmailDto);
    }

    @Post('otp/resend')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 3, ttl: 60000 } })
    @ResponseMessage('Send otp successfully')
    async resendOtp(@Body() createUserEmailDto: CreateUserEmailDto) {
        return this.authService.resendOtp(createUserEmailDto.email);
    }

    @Post('active-user-email')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 3, ttl: 60000 } })
    @ResponseMessage('Active User Email Success')
    async activeUserEmail(@Body() verifyOtpDto: VerifyOtpDto) {
        return this.authService.activeUserEmail(verifyOtpDto.email, verifyOtpDto.otpCode);
    }

    @Post('create-password')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 3, ttl: 60000 } })
    @ResponseMessage('Create Password Success')
    async createPassword(@Body() createUserDto: CreateUserDto) {
        return this.authService.createPassword(createUserDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Login Success')
    async login(@Body() createUserDto: CreateUserDto & TurnstileTokenDto) {
        return this.authService.login(createUserDto);
    }

    @Post('token/refresh')
    @UseGuards(RfJwtGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Refresh Token Success')
    async refreshToken(@Req() req: Request) {
        return this.authService.refreshToken(req['user'] as JwtPayload);
    }

    @Post('logout')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Logout Success')
    async logout(@Req() req: Request) {
        return this.authService.logout(req['user'] as JwtPayload);
    }
}
