import { Prisma, UserStatus } from '@prisma/client';
import { IsBoolean, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateUserDto implements Prisma.UserUpdateInput {
    @IsOptional()
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
        message:
            'Password must have at least 6 characters and must contain 1 lowercase letter and 1 number',
    })
    password?: string;

    @IsOptional()
    @IsString()
    full_namee?: string;

    @IsOptional()
    @IsString()
    avatar_url?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsBoolean()
    status?: UserStatus;
}
