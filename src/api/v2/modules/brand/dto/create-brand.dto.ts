import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBrandDto {
    @ApiProperty({
        description: 'Name of the brand',
        example: 'Nike',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Description of the brand',
        example: 'Just Do It',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;
}
