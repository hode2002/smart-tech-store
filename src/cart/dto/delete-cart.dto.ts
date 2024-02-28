import { IsString, IsNotEmpty } from 'class-validator';

export class DeleteCartDto {
    @IsString()
    @IsNotEmpty()
    productOptionId: string;
}
