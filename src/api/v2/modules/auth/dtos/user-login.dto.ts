import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDto {
    @ApiProperty({ description: 'The email of the user', example: 'user@example.com' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'The password of the user', example: 'pass123' })
    @IsNotEmpty()
    @IsString()
    password: string;
}
