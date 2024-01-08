import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AtJwtGuard } from 'src/auth/guards';
import { GetEmail } from 'src/common/decorators/';
import { ForgetPassDto, UpdateUserDto } from './dto';
import { CreateUserEmailDto } from 'src/auth/dto';
import { Request } from 'express';
import { SuccessResponse } from 'src/common/response';

@Controller('/api/v1/users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('profile')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async getProfile(@GetEmail() email: string): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Get user profile success',
            data: await this.userService.getProfile(email),
        };
    }

    @Post('change-pass')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async changePass(
        @Body() forgetPassDto: ForgetPassDto,
    ): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Change password success',
            data: await this.userService.changePass(forgetPassDto),
        };
    }

    @Post('reset-pass')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async resetPass(
        @Body() createUserEmailDto: CreateUserEmailDto,
    ): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Send new password success',
            data: await this.userService.resetPass(createUserEmailDto),
        };
    }

    @Patch('profile')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async updateProfile(
        @Req() req: Request,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Update user profile success',
            data: await this.userService.updateByEmail(
                req.user['email'],
                updateUserDto,
            ),
        };
    }
}
