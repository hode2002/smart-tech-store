import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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

    @IsArray()
    @IsOptional()
    images?: string[];

    @IsString()
    @IsOptional()
    video_url?: string;
}
