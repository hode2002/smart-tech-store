import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDeliveryDto {
    @ApiPropertyOptional({
        description: 'Name of the delivery method',
        example: 'Express Delivery',
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({
        description: 'Status of the delivery method',
    })
    @IsNumber()
    @IsOptional()
    status?: number;
}
