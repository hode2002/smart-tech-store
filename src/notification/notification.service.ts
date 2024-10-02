import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateSlug } from 'src/utils';

@Injectable()
export class NotificationService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(createNotificationDto: CreateNotificationDto) {
        const slug = generateSlug(createNotificationDto.title);
        return await this.prismaService.notification.create({
            data: {
                ...createNotificationDto,
                slug,
            },
        });
    }

    async findByUserId(userId: string) {
        if (!userId) {
            throw new BadRequestException('Missing user id');
        }
        return await this.prismaService.notification.findMany({
            where: { user_id: userId },
            orderBy: {
                created_at: 'desc',
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

    async update(userId: string, updateNotificationDto: UpdateNotificationDto) {
        const updated = await this.prismaService.notification.updateMany({
            where: { user_id: userId },
            data: { status: updateNotificationDto.status },
        });
        return updated;
    }
}
