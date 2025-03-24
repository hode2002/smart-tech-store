import { IsBoolean, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
        message:
            'Password must have at least 6 characters and must contain 1 lowercase letter and 1 number',
    })
    password?: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    avatar?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    refresh_token?: string;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}
