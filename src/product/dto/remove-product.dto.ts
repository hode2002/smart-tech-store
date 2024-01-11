import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveProductDto {
    @IsNumber()
    @IsNotEmpty()
    productId: number;

    @IsNumber()
    @IsNotEmpty()
    variantId: number;
}
