import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDeliveryDto {
    @ApiProperty({
        description: 'Name of the delivery method',
        example: 'Express Delivery',
    })
    @IsString()
    @IsNotEmpty()
    name: string;
}
