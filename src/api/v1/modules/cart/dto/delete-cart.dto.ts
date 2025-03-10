import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteCartDto {
    @IsString()
    @IsNotEmpty()
    productOptionId: string;
}
