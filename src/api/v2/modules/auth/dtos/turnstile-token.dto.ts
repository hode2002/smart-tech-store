import { IsNotEmpty, IsString } from 'class-validator';

export class TurnstileTokenDto {
    @IsString()
    @IsNotEmpty()
    turnstileToken: string;
}
