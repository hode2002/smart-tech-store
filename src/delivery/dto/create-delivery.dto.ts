import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDeliveryDto {
    @IsNotEmpty()
    @IsString()
    name: string;
}
