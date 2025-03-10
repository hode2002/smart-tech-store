import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ThirdPartyLoginDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    avatar: string;
}
