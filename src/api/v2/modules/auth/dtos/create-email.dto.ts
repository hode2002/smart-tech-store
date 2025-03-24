import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserEmailDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}
