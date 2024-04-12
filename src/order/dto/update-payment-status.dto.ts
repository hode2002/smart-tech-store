import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePaymentStatusDto {
    @IsString()
    @IsNotEmpty()
    transaction_id: string;
}
