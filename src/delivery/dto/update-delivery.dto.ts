import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateDeliveryDto {
    @IsNotEmpty()
    @IsString()
    name: string;
}
