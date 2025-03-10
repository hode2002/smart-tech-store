import { NotificationType } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
    @IsString()
    @IsOptional()
    user_id?: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsNotEmpty()
    images: string;

    @IsString()
    @IsOptional()
    type?: NotificationType;

    @IsString()
    @IsNotEmpty()
    link: string;
}
