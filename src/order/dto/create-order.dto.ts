import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsOptional()
    order_date?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsNotEmpty()
    @IsString()
    province: string;

    @IsNotEmpty()
    @IsString()
    district: string;

    @IsNotEmpty()
    @IsString()
    ward: string;

    @IsOptional()
    @IsString()
    hamlet?: string;

    @IsString()
    @IsOptional()
    note?: string;

    @IsString()
    @IsNotEmpty()
    delivery_id: string;

    @IsString()
    @IsNotEmpty()
    payment_method: string;

    @IsNotEmpty()
    order_details: OrderDetailDto[];
}

class OrderDetailDto {
    @IsString()
    @IsNotEmpty()
    product_option_id: string;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsNumber()
    @IsNotEmpty()
    price: number;
}
