import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCartDto {
    @IsString()
    @IsNotEmpty()
    productOptionId: string;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;
}
