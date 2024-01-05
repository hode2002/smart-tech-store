import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class ForgetPassDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
        message:
            'Password must be at least 6 characters and must contain 1 lowercase character',
    })
    oldPass: string;

    @IsNotEmpty()
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
        message:
            'Password must be at least 6 characters and must contain 1 lowercase character',
    })
    newPass: string;
}
