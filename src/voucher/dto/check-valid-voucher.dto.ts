import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CheckValidVoucherDto {
    @IsString()
    @IsNotEmpty()
    voucherCode: string;

    @IsNumber()
    @IsNotEmpty()
    totalOrderPrice: number;
}
