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
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';
import { Request } from 'express';

import { GetEmail, GetUserId, Permission, ResponseMessage } from '@/common/decorators';
import { RoleGuard } from '@/common/guards';
import { CreateUserEmailDto, TurnstileTokenDto } from '@v1/modules/auth/dto';
import { AtJwtGuard } from '@v1/modules/auth/guards';

import { ChangePasswordDto, UpdateUserAddressDto, UpdateUserDto, UpdateUserStatusDto } from './dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @ResponseMessage('Get all users success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async getAll() {
        return await this.userService.getAll();
    }

    @Post('')
    @ResponseMessage('Update user status success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async updateStatusByEmail(@Body() updateUserStatusDto: UpdateUserStatusDto) {
        return await this.userService.updateStatusByEmail(updateUserStatusDto);
    }

    @Get('profile')
    @ResponseMessage('Get user profile success')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async getProfile(@GetEmail() email: string) {
        return await this.userService.getProfile(email);
    }

    @Get('address')
    @ResponseMessage('Get user address success')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async getAddress(@GetEmail() email: string) {
        return await this.userService.getAddress(email);
    }

    @Post('change-password')
    @ResponseMessage('Change password success')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async changePassword(
        @GetEmail() email: string,
        @Body() changePasswordDto: ChangePasswordDto & TurnstileTokenDto,
    ) {
        return await this.userService.changePassword(email, changePasswordDto);
    }

    @Post('reset-password')
    @ResponseMessage('Send new password success')
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Body() createUserEmailDto: CreateUserEmailDto) {
        return await this.userService.resetPassword(createUserEmailDto);
    }

    @Patch('profile')
    @ResponseMessage('Update user profile success')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async updateProfile(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
        return await this.userService.updateByEmail(req.user['email'], updateUserDto);
    }

    @Patch('address')
    @ResponseMessage('Update address success')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async updatedAddress(
        @GetUserId() userId: string,
        @Body() updateUserAddressDto: UpdateUserAddressDto,
    ) {
        return await this.userService.updatedAddress(userId, updateUserAddressDto);
    }

    @Patch('avatar')
    @ResponseMessage('Update avatar success')
    @UseGuards(AtJwtGuard)
    @UseInterceptors(FileInterceptor('avatar'))
    @HttpCode(HttpStatus.OK)
    async upload(@GetEmail() email: string, @UploadedFile() file: Express.Multer.File) {
        return await this.userService.updateAvatar(email, file);
    }
}
