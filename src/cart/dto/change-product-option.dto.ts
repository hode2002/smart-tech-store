import { IsString, IsNotEmpty } from 'class-validator';

export class ChangeProductOptionDto {
    @IsString()
    @IsNotEmpty()
    newOptionId: string;

    @IsString()
    @IsNotEmpty()
    oldOptionId: string;
}
