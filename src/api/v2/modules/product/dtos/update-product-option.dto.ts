import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { TechnicalSpecs } from '@v2/modules/product/dtos';

class ProductImageDto {
    @ApiPropertyOptional({ description: 'Image URL' })
    @IsNotEmpty()
    @IsString()
    image_url: string;

    @ApiPropertyOptional({ description: 'Image alt text' })
    @IsOptional()
    @IsString()
    image_alt_text: string;
}

export class UpdateProductOptionDto {
    @ApiPropertyOptional({ description: 'Product option ID' })
    @IsString()
    @IsOptional()
    id?: string;

    @ApiPropertyOptional({ description: 'Thumbnail image URL' })
    @IsString()
    @IsOptional()
    thumbnail?: string;

    @ApiPropertyOptional({ description: 'Product images', type: [ProductImageDto] })
    @IsOptional()
    @IsArray()
    product_images?: Array<ProductImageDto>;

    @ApiPropertyOptional({ description: 'Label image URL' })
    @IsOptional()
    @IsString()
    label_image?: string;

    @ApiPropertyOptional({ description: 'Price modifier' })
    @IsOptional()
    @IsNumber()
    price_modifier?: number;

    @ApiPropertyOptional({ description: 'Stock quantity' })
    @IsOptional()
    @IsNumber()
    stock?: number;

    @ApiPropertyOptional({ description: 'Discount percentage' })
    @IsOptional()
    @IsNumber()
    discount?: number;

    @ApiPropertyOptional({ description: 'Is on sale' })
    @IsOptional()
    @IsBoolean()
    is_sale?: boolean;

    @ApiPropertyOptional({ description: 'Is deleted' })
    @IsOptional()
    @IsBoolean()
    is_deleted?: boolean;

    @ApiPropertyOptional({ description: 'Technical specifications', type: [TechnicalSpecs] })
    @IsArray()
    technical_specs: TechnicalSpecs[];
}
