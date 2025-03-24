import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Patch,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    Inject,
    Query,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { GetUserId, Permission, ResponseMessage } from '@/common/decorators';
import { PaginationDto } from '@/common/dtos';
import { RoleGuard } from '@/common/guards';
import { FileUploadInterceptor } from '@/common/interceptors';
import { TurnstileTokenDto } from '@v2/modules/auth/dtos';
import { AtJwtGuard } from '@v2/modules/auth/guards';
import { USER_TOKENS } from '@v2/modules/user/constants';
import {
    ChangePasswordDto,
    UpdateUserAddressDto,
    UpdateUserDto,
    UpdateUserStatusDto,
} from '@v2/modules/user/dto';
import { IUserCommandService, IUserQueryService } from '@v2/modules/user/interfaces';

@Controller('users')
export class UserController {
    constructor(
        @Inject(USER_TOKENS.SERVICES.USER_QUERY_SERVICE)
        private readonly userQueryService: IUserQueryService,
        @Inject(USER_TOKENS.SERVICES.USER_COMMAND_SERVICE)
        private readonly userCommandService: IUserCommandService,
    ) {}

    @Get()
    @ResponseMessage('Get all users successfully')
    @ApiBearerAuth('access-token')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(@Query() paginationDto: PaginationDto) {
        return this.userQueryService.findAll(paginationDto.page, paginationDto.limit);
    }

    @Get('profile')
    @ResponseMessage('Get user profile successfully')
    @ApiBearerAuth('access-token')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async getProfile(@GetUserId() userId: string) {
        return this.userQueryService.getProfile(userId);
    }

    @Get('profile/address')
    @ResponseMessage('Get user profile successfully')
    @ApiBearerAuth('access-token')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async getProfileWithAddress(@GetUserId() userId: string) {
        return this.userQueryService.getProfileWithAddress(userId);
    }

    @Get('address')
    @ResponseMessage('Get user address successfully')
    @ApiBearerAuth('access-token')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async getAddress(@GetUserId() userId: string) {
        return this.userQueryService.getAddress(userId);
    }

    @Post('change-password')
    @ResponseMessage('Change password successfully')
    @ApiBearerAuth('access-token')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async changePassword(
        @GetUserId() userId: string,
        @Body() changePasswordDto: ChangePasswordDto & TurnstileTokenDto,
    ) {
        return this.userCommandService.changePassword(userId, changePasswordDto);
    }

    @Patch('profile')
    @ResponseMessage('Update user profile successfully')
    @ApiBearerAuth('access-token')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async updateProfile(@GetUserId() userId: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userCommandService.updateProfile(userId, updateUserDto);
    }

    @Patch('address')
    @ResponseMessage('Update address successfully')
    @ApiBearerAuth('access-token')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async updatedAddress(
        @GetUserId() userId: string,
        @Body() updateUserAddressDto: UpdateUserAddressDto,
    ) {
        return this.userCommandService.updatedAddress(userId, updateUserAddressDto);
    }

    @Patch('avatar')
    @ResponseMessage('Update avatar successfully')
    @ApiBearerAuth('access-token')
    @UseGuards(AtJwtGuard)
    @UseInterceptors(FileUploadInterceptor.CustomSingleField('avatar'))
    @HttpCode(HttpStatus.OK)
    async upload(@GetUserId() userId: string, @UploadedFile() file: Express.Multer.File) {
        return this.userCommandService.updateAvatar(userId, file);
    }

    @Patch()
    @ResponseMessage('Update user status successfully')
    @ApiBearerAuth('access-token')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async updateStatusByEmail(@Body() updateUserStatusDto: UpdateUserStatusDto) {
        return this.userCommandService.updateStatusByEmail(updateUserStatusDto);
    }
}
