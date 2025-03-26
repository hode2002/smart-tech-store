import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {
    @ApiProperty({ description: 'ID of the product option', type: String })
    @IsString()
    @IsNotEmpty()
    product_option_id: string;

    @ApiProperty({ description: 'Star rating for the review', type: Number })
    @IsNumber()
    @IsNotEmpty()
    star: number;

    @ApiProperty({ description: 'Comment for the review', type: String })
    @IsString()
    @IsNotEmpty()
    comment: string;

    @ApiProperty({ description: 'Array of image URLs', type: [String], required: false })
    @IsArray()
    @IsOptional()
    images?: string[];

    @ApiProperty({ description: 'Video URL related to the review', type: String, required: false })
    @IsString()
    @IsOptional()
    video_url?: string;
}
