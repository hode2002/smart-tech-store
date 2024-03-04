import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
    @IsString()
    @IsNotEmpty()
    product_option_id: string;

    @IsNumber()
    @IsNotEmpty()
    star: number;

    @IsString()
    @IsNotEmpty()
    comment: string;
}
