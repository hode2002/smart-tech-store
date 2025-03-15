import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

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
    @IsBoolean()
    @IsOptional()
    is_deleted?: boolean;
}
