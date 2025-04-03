import { UserStatus } from '@prisma/client';
import { IsBoolean, IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserStatusDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsBoolean()
    status?: UserStatus;
}
