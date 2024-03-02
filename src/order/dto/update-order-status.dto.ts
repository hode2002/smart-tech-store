import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateOrderStatusDto {
    @IsNumber()
    @IsNotEmpty()
    @IsEnum([1, 2], {
        message: 'Invalid order status. SHIPPING or RECEIVED only accepted',
    })
    status: number;
}
