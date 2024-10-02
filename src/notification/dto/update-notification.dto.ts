import { IsNumber, IsOptional } from 'class-validator';

export class UpdateNotificationDto {
    @IsNumber()
    @IsOptional()
    status?: number;
}
