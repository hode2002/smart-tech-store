import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { IsNumber, IsOptional } from 'class-validator';

import { CreateVoucherDto } from '@v2/modules/voucher/dtos';

export class UpdateVoucherDto extends PartialType(CreateVoucherDto) {
    @ApiProperty({ description: 'Status of the voucher', example: 1, required: false })
    @IsNumber()
    @IsOptional()
    status?: Status;
}
