import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CalculateShippingFeeDto {
    @IsNotEmpty()
    @IsString()
    province: string;

    @IsNotEmpty()
    @IsString()
    district: string;

    @IsNotEmpty()
    @IsString()
    ward: string;

    @IsNotEmpty()
    @IsNumber()
    weight: number;

    @IsNotEmpty()
    @IsNumber()
    value: number;
}
