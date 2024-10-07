import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    UseGuards,
    HttpCode,
    HttpStatus,
    Delete,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { GetUserId, Permission } from 'src/common/decorators';
import { AtJwtGuard } from 'src/auth/guards';
import { SuccessResponse } from 'src/common/response';
import { RoleGuard } from 'src/common/guards';
import { Role } from '@prisma/client';

@Controller('/api/v1/notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Post()
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() createNotificationDto: CreateNotificationDto,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Create success',
            data: await this.notificationService.create(createNotificationDto),
        };
    }

    @Get()
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Get notifications success',
            data: await this.notificationService.findAll(),
        };
    }

    @Get('users')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async findByUserId(@GetUserId() userId: string): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Get user notify success',
            data: await this.notificationService.findByUserId(userId),
        };
    }

    @Post('users/read-all')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async userReadAllNotifications(
        @GetUserId() userId: string,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Update success',
            data: await this.notificationService.userReadAllNotifications(
                userId,
            ),
        };
    }

    @Post('users')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.CREATED)
    async createUserNotification(
        @Body() createNotificationDto: CreateNotificationDto,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Create success',
            data: await this.notificationService.createUserNotification(
                createNotificationDto,
            ),
        };
    }

    @Get('slug/:slug')
    @HttpCode(HttpStatus.OK)
    async findBySlug(@Param('slug') slug: string): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Get notifications success',
            data: await this.notificationService.findBySlug(slug),
        };
    }

    @Patch(':id')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id') id: string,
        @Body() updateNotificationDto: UpdateNotificationDto,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Update success',
            data: await this.notificationService.update(
                id,
                updateNotificationDto,
            ),
        };
    }

    @Delete(':id')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Delete success',
            data: await this.notificationService.remove(id),
        };
    }
}
