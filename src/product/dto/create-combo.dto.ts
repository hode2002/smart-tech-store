import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateComboDto {
    @IsString()
    @IsNotEmpty()
    mainProductId: string;

    @IsArray()
    @IsNotEmpty()
    productCombos: ProductCombo[];
}

class ProductCombo {
    @IsString()
    @IsNotEmpty()
    productComboId: string;

    @IsNumber()
    @IsNotEmpty()
    discount: number;
}
