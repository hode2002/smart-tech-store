import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.* ).{6,}$/, {
        message:
            'Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter and it must be 6 characters long.',
    })
    password: string;
}
