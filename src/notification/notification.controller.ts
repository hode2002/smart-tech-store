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
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { GetUserId } from 'src/common/decorators';
import { AtJwtGuard } from 'src/auth/guards';
import { SuccessResponse } from 'src/common/response';

@Controller('/api/v1/notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Post()
    @UseGuards(AtJwtGuard)
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

    @Get('slug/:slug')
    @HttpCode(HttpStatus.OK)
    async findBySlug(@Param('slug') slug: string): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Get notifications success',
            data: await this.notificationService.findBySlug(slug),
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

    @Patch()
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @GetUserId() userId: string,
        @Body() updateNotificationDto: UpdateNotificationDto,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Update success',
            data: await this.notificationService.update(
                userId,
                updateNotificationDto,
            ),
        };
    }
}
