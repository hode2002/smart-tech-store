import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateBrandDto {
    @ApiProperty({
        description: 'Description of the brand',
        example: 'Updated brand description',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Soft delete status of the brand',
        example: false,
        required: false,
    })
    @IsEnum(Status)
    @IsOptional()
    status?: Status;
}
