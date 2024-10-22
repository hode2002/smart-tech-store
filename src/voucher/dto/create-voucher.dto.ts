import { VoucherType } from '@prisma/client';
import {
    IsNotEmpty,
    IsNumber,
    IsString,
    IsDateString,
    IsOptional,
} from 'class-validator';

export class CreateVoucherDto {
    @IsString()
    @IsNotEmpty()
    type: VoucherType;

    @IsString()
    @IsOptional()
    code?: string;

    @IsNumber()
    @IsNotEmpty()
    value: number;

    @IsDateString()
    @IsNotEmpty()
    start_date: string;

    @IsDateString()
    @IsNotEmpty()
    end_date: string;

    @IsNumber()
    @IsNotEmpty()
    available_quantity: number;

    @IsNumber()
    @IsNotEmpty()
    min_order_value: number;
}