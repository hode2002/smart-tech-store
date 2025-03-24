import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TurnstileTokenDto {
    @ApiProperty({ description: 'The Turnstile token for verification', example: 'abc123token' })
    @IsString()
    @IsNotEmpty()
    turnstileToken: string;
}
