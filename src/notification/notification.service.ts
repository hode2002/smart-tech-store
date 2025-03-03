import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { generateSlug } from 'src/utils';

import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(createNotificationDto: CreateNotificationDto) {
        const slug = generateSlug(createNotificationDto.title);
        const users = await this.prismaService.user.findMany({
            where: { is_active: true, role: 'USER' },
        });

        const notification = await this.prismaService.notification.create({
            data: {
                ...createNotificationDto,
                slug,
            },
        });

        const notificationPromises = users.map(user => {
            return this.prismaService.userNotification.create({
                data: {
                    user_id: user.id,
                    notification_id: notification.id,
                },
            });
        });
        await Promise.all(notificationPromises);

        return notification;
    }

    async createUserNotification(createNotificationDto: CreateNotificationDto) {
        if (!createNotificationDto?.user_id) {
            throw new BadRequestException('Missing user id');
        }

        const { user_id, ...other } = createNotificationDto;

        const slug = generateSlug(createNotificationDto.title);
        const notification = await this.prismaService.notification.create({
            data: {
                ...other,
                slug,
            },
        });

        return await this.prismaService.userNotification.create({
            data: {
                user_id,
                notification_id: notification.id,
            },
            include: {
                notification: true,
            },
        });
    }

    async findAll() {
        return await this.prismaService.notification.findMany({
            where: {
                type: {
                    not: 'ORDER',
                },
            },
            orderBy: {
                created_at: 'desc',
            },
        });
    }

    async findByUserId(userId: string) {
        if (!userId) {
            throw new BadRequestException('Missing user id');
        }
        return await this.prismaService.userNotification.findMany({
            where: { user_id: userId },
            orderBy: {
                created_at: 'desc',
            },
            select: {
                status: true,
                notification: true,
            },
        });
    }

    async findById(id: string) {
        if (!id) {
            throw new BadRequestException('Missing notify id');
        }
        const notify = await this.prismaService.notification.findUnique({
            where: { id },
        });
        if (!notify) {
            throw new NotFoundException('Notification not found');
        }
        return notify;
    }

    async findBySlug(slug: string) {
        if (!slug) {
            throw new BadRequestException('Missing slug');
        }
        const notify = await this.prismaService.notification.findFirst({
            where: { slug },
        });
        if (!notify) {
            throw new NotFoundException('Notification not found');
        }
        return notify;
    }

    async update(notificationId: string, updateNotificationDto: UpdateNotificationDto) {
        const notification = await this.prismaService.notification.findUnique({
            where: { id: notificationId },
        });
        if (!notification) {
            throw new NotFoundException('Notification not found!');
        }
        return await this.prismaService.notification.update({
            where: { id: notificationId },
            data: { ...updateNotificationDto },
        });
    }

    async userReadAllNotifications(userId: string) {
        return await this.prismaService.userNotification.updateMany({
            where: { user_id: userId },
            data: { status: 1 },
        });
    }

    async remove(id: string) {
        return await this.prismaService.notification.delete({
            where: { id },
        });
    }
}
