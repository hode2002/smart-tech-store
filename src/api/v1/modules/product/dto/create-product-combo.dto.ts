import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductComboDto {
    @IsString()
    @IsNotEmpty()
    comboId: string;

    @IsString()
    @IsNotEmpty()
    productOptionId: string;

    @IsNumber()
    @IsNumber()
    discount: number;
}
