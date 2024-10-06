import { PartialType } from '@nestjs/mapped-types';
import { CreateVoucherDto } from './create-voucher.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateVoucherDto extends PartialType(CreateVoucherDto) {
    @IsNumber()
    @IsOptional()
    status?: number;
}
