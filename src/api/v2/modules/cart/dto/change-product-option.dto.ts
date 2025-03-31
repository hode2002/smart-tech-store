import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeProductOptionDto {
    @ApiProperty({
        description: 'The ID of the new product option',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @IsString()
    @IsNotEmpty()
    newOptionId: string;

    @ApiProperty({
        description: 'The ID of the old product option to replace',
        example: '550e8400-e29b-41d4-a716-446655440001',
    })
    @IsString()
    @IsNotEmpty()
    oldOptionId: string;
}
