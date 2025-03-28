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
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';

import { ResponseMessage } from '@/common/decorators';
import { UserLoginDto, CreateUserEmailDto, VerifyOtpDto } from '@v2/modules/auth/dtos';
import { TokenService } from '@v2/modules/auth/services';
import { AuthService } from '@v2/modules/auth/services/auth.service';
import { SocialAuthService } from '@v2/modules/auth/services/social.auth.service';

import { AtJwtGuard, FacebookGuard, GoogleGuard, RfJwtGuard } from './guards';

@ApiTags('Auth')
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
    @ApiOperation({ summary: 'Verify user email' })
    @ApiResponse({ status: 200, description: 'Email verification successful.' })
    @ApiBody({ type: CreateUserEmailDto })
    async emailVerification(@Body() createUserEmailDto: CreateUserEmailDto) {
        return this.authService.verifyEmail(createUserEmailDto.email);
    }

    @Get('facebook')
    @UseGuards(FacebookGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Redirect to facebook login')
    @ApiOperation({ summary: 'Redirect to Facebook login' })
    @ApiResponse({ status: 200, description: 'Redirected to Facebook login.' })
    async facebookLogin() {
        return { success: true };
    }

    @Get('facebook/redirect')
    @UseGuards(FacebookGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Login with Facebook successfully')
    @ApiOperation({ summary: 'Handle Facebook login redirect' })
    @ApiResponse({ status: 200, description: 'Logged in with Facebook successfully.' })
    async facebookLoginRedirect(@Req() req: Request, @Res() res: Response) {
        return this.socialAuthService.facebookLogin(req, res);
    }

    @Get('google')
    @UseGuards(GoogleGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Redirect to Google login')
    @ApiOperation({ summary: 'Redirect to Google login' })
    @ApiResponse({ status: 200, description: 'Redirected to Google login.' })
    async googleLogin() {
        return { success: true };
    }

    @Get('google/redirect')
    @UseGuards(GoogleGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Login with Google successfully')
    @ApiOperation({ summary: 'Handle Google login redirect' })
    @ApiResponse({ status: 200, description: 'Logged in with Google successfully.' })
    async googleLoginRedirect(@Req() req: Request, @Res() res: Response) {
        return this.socialAuthService.googleLogin(req, res);
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

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User registered successfully.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiBody({ type: CreateUserEmailDto })
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @ResponseMessage('Send OTP successfully')
    async register(@Body() createUserEmailDto: CreateUserEmailDto) {
        return this.authService.register(createUserEmailDto.email);
    }

    @Post('otp/resend')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @ResponseMessage('Send OTP successfully')
    @ApiOperation({ summary: 'Resend OTP to user email' })
    @ApiResponse({ status: 200, description: 'OTP resent successfully.' })
    @ApiBody({ type: CreateUserEmailDto })
    async resendOtp(@Body() createUserEmailDto: CreateUserEmailDto) {
        return this.authService.register(createUserEmailDto.email);
    }

    @Post('active')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @ResponseMessage('Active User Email Success')
    @ApiOperation({ summary: 'Activate user email with OTP' })
    @ApiResponse({ status: 200, description: 'User email activated successfully.' })
    @ApiBody({ type: VerifyOtpDto })
    async activeUserEmail(@Body() verifyOtpDto: VerifyOtpDto) {
        return this.authService.activeEmail(verifyOtpDto.email, verifyOtpDto.otpCode);
    }

    @Post('create-password')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @ResponseMessage('Create Password Success')
    @ApiOperation({ summary: 'Create a new password for user' })
    @ApiResponse({ status: 200, description: 'Password created successfully.' })
    @ApiBody({ type: UserLoginDto })
    async createPassword(@Body() createUserDto: UserLoginDto) {
        return this.authService.createPassword(createUserDto.email, createUserDto.password);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login a user' })
    @ApiResponse({ status: 200, description: 'User logged in successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiBody({ type: UserLoginDto })
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Login Success')
    async login(@Res({ passthrough: true }) res: Response, @Body() userLoginDto: UserLoginDto) {
        return this.authService.login(res, userLoginDto.email, userLoginDto.password);
    }

    @Post('token/refresh')
    @ApiBearerAuth('access-token')
    @UseGuards(RfJwtGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Refresh token successfully')
    @ApiOperation({ summary: 'Refresh user access token' })
    @ApiResponse({ status: 200, description: 'Token refreshed successfully.' })
    async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        return this.tokenService.refreshToken(req, res);
    }

    @Post('logout')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Logout a user' })
    @ApiResponse({ status: 200, description: 'User logged out successfully.' })
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    @ResponseMessage('Logged out Successfully')
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        return this.authService.logout(req, res);
    }

    @Post('forgot-password')
    @ResponseMessage('Send new password success')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Send new password to user email' })
    @ApiResponse({ status: 200, description: 'New password sent successfully.' })
    @ApiBody({ type: CreateUserEmailDto })
    async resetPassword(@Body() createUserEmailDto: CreateUserEmailDto) {
        return await this.authService.forgotPassword(createUserEmailDto.email);
    }
}
