import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateProductComboDto {
    @IsArray()
    @IsNotEmpty()
    productCombos: ProductCombo[];
}

class ProductCombo {
    @IsString()
    @IsNotEmpty()
    product_option_id: string;

    @IsNumber()
    @IsNotEmpty()
    discount: number;
}
