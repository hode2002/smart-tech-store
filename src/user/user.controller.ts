import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Patch,
    Post,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AtJwtGuard } from 'src/auth/guards';
import { GetEmail, GetUserId, Permission } from 'src/common/decorators/';
import {
    ChangePasswordDto,
    UpdateUserAddressDto,
    UpdateUserDto,
    UpdateUserStatusDto,
} from './dto';
import { CreateUserEmailDto } from 'src/auth/dto';
import { Request } from 'express';
import { SuccessResponse } from 'src/common/response';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/common/guards';

@Controller('/api/v1/users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async getAll(): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Get all users success',
            data: await this.userService.getAll(),
        };
    }

    @Post('')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async updateStatusByEmail(
        @Body() updateUserStatusDto: UpdateUserStatusDto,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Update user status success',
            data: await this.userService.updateStatusByEmail(
                updateUserStatusDto,
            ),
        };
    }

    @Get('profile')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async getProfile(@GetEmail() email: string): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Get user profile success',
            data: await this.userService.getProfile(email),
        };
    }

    @Get('address')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async getAddress(@GetEmail() email: string): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Get user address success',
            data: await this.userService.getAddress(email),
        };
    }

    @Post('change-password')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async changePass(
        @GetEmail() email: string,
        @Body() changePasswordDto: ChangePasswordDto,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Change password success',
            data: await this.userService.changePassword(
                email,
                changePasswordDto,
            ),
        };
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    async resetPass(
        @Body() createUserEmailDto: CreateUserEmailDto,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Send new password success',
            data: await this.userService.resetPassword(createUserEmailDto),
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
            statusCode: HttpStatus.OK,
            message: 'Update user profile success',
            data: await this.userService.updateByEmail(
                req.user['email'],
                updateUserDto,
            ),
        };
    }

    @Patch('address')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async updatedAddress(
        @GetUserId() userId: string,
        @Body() updateUserAddressDto: UpdateUserAddressDto,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Update address success',
            data: await this.userService.updatedAddress(
                userId,
                updateUserAddressDto,
            ),
        };
    }

    @Patch('avatar')
    @UseGuards(AtJwtGuard)
    @UseInterceptors(FileInterceptor('avatar'))
    @HttpCode(HttpStatus.OK)
    async upload(
        @GetEmail() email: string,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Update avatar success',
            data: await this.userService.updateAvatar(email, file),
        };
    }
}
