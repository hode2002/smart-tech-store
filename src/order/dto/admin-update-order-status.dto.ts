import { IsNotEmpty, IsNumber } from 'class-validator';

export class AdminUpdateOrderStatusDto {
    @IsNumber()
    @IsNotEmpty()
    status: number;
}
