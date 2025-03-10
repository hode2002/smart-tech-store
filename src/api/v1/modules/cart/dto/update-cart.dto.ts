import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateCartDto {
    @IsString()
    @IsNotEmpty()
    productOptionId: string;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;
}
