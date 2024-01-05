import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
        message:
            'Password must be at least 6 characters and must contain 1 lowercase character',
    })
    password: string;
}
