import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyOtpDto {
    @ApiProperty({ description: 'The email of the user', example: 'user@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'The OTP code sent to the user', example: '123456' })
    @IsNotEmpty()
    @IsString()
    otpCode: string;
}
