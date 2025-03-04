import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';

import { AtJwtGuard } from 'src/auth/guards';
import { GetUserId, Permission, ResponseMessage } from 'src/common/decorators';
import { RoleGuard } from 'src/common/guards';

import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Post()
    @ResponseMessage('Create success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createNotificationDto: CreateNotificationDto) {
        return await this.notificationService.create(createNotificationDto);
    }

    @Get()
    @ResponseMessage('Get notifications success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async findAll() {
        return await this.notificationService.findAll();
    }

    @Get('users')
    @ResponseMessage('Get user notify success')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async findByUserId(@GetUserId() userId: string) {
        return await this.notificationService.findByUserId(userId);
    }

    @Post('users/read-all')
    @ResponseMessage('Update success')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async userReadAllNotifications(@GetUserId() userId: string) {
        return await this.notificationService.userReadAllNotifications(userId);
    }

    @Post('users')
    @ResponseMessage('Create success')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.CREATED)
    async createUserNotification(@Body() createNotificationDto: CreateNotificationDto) {
        return await this.notificationService.createUserNotification(createNotificationDto);
    }

    @Get('slug/:slug')
    @ResponseMessage('Get notifications success')
    @HttpCode(HttpStatus.OK)
    async findBySlug(@Param('slug') slug: string) {
        return await this.notificationService.findBySlug(slug);
    }

    @Patch(':id')
    @ResponseMessage('Update success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
        return await this.notificationService.update(id, updateNotificationDto);
    }

    @Delete(':id')
    @ResponseMessage('Delete success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string) {
        return await this.notificationService.remove(id);
    }
}
