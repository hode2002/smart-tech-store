import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteCartDto {
    @ApiProperty({
        description: 'The ID of the product option to remove from cart',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @IsString()
    @IsNotEmpty()
    productOptionId: string;
}
