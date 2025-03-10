import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';

import { CreateVoucherDto } from './create-voucher.dto';

export class UpdateVoucherDto extends PartialType(CreateVoucherDto) {
    @IsNumber()
    @IsOptional()
    status?: number;
}
