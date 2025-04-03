import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CheckValidVoucherDto {
    @ApiProperty({ description: 'The code of the voucher to check', example: 'SAVE20' })
    @IsString()
    @IsNotEmpty()
    voucherCode: string;

    @ApiProperty({ description: 'Total order price to validate the voucher', example: 100 })
    @IsNumber()
    @IsNotEmpty()
    totalOrderPrice: number;
}
