import { ApiProperty } from '@nestjs/swagger';
import { VoucherType } from '@prisma/client';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateVoucherDto {
    @ApiProperty({ description: 'Name of the voucher', example: 'Black Friday Sale' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Type of the voucher', example: 'DISCOUNT' })
    @IsString()
    @IsNotEmpty()
    type: VoucherType;

    @ApiProperty({ description: 'Code for the voucher', example: 'SAVE20', required: false })
    @IsString()
    @IsOptional()
    code?: string;

    @ApiProperty({ description: 'Value of the voucher', example: 20 })
    @IsNumber()
    @IsNotEmpty()
    value: number;

    @ApiProperty({ description: 'Start date of the voucher', example: '2023-01-01' })
    @IsDateString()
    @IsNotEmpty()
    start_date: string;

    @ApiProperty({ description: 'End date of the voucher', example: '2023-12-31' })
    @IsDateString()
    @IsNotEmpty()
    end_date: string;

    @ApiProperty({ description: 'Available quantity of the voucher', example: 100 })
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty({ description: 'Minimum order value to use the voucher', example: 50 })
    @IsNumber()
    @IsNotEmpty()
    min_order_value: number;

    @ApiProperty({ description: 'Maximum discount value of the voucher', example: 50 })
    @IsNumber()
    @IsNotEmpty()
    max_discount: number;
}
