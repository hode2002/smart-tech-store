import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({
        description: 'The name of the category',
        example: 'Headphone',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'The description of the category',
        example: 'Headphone for gaming and music',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'The parent id of the category',
        example: '123',
        required: false,
    })
    @IsString()
    @IsOptional()
    parent_id?: string;

    @ApiProperty({
        description: 'The image of the category',
        example: 'https://example.com/image.jpg',
        required: false,
    })
    @IsString()
    @IsOptional()
    image?: string;
}
