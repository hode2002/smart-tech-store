import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ApplyVoucherDto {
    @ApiProperty({ description: 'The id of the order to apply', example: 'SAVE20' })
    @IsString()
    @IsNotEmpty()
    orderId: string;

    @ApiProperty({ description: 'The code of the voucher', example: 'SAVE20' })
    @IsString()
    @IsNotEmpty()
    voucherCode: string;
}
