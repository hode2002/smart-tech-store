import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { TechnicalSpecs } from '@v2/modules/product/dtos';

class ProductImageDto {
    @ApiProperty({ description: 'Image URL' })
    @IsNotEmpty()
    @IsString()
    image_url: string;

    @ApiPropertyOptional({ description: 'Image alt text' })
    @IsOptional()
    @IsString()
    image_alt_text: string;
}

class ProductOptionValue {
    @ApiProperty({ description: 'Option ID' })
    @IsNotEmpty()
    @IsString()
    option_id: string;

    @ApiProperty({ description: 'Option value' })
    @IsNotEmpty()
    @IsString()
    value: string;

    @ApiProperty({ description: 'Price adjustment' })
    @IsNotEmpty()
    @IsNumber()
    adjust_price: number;
}

class ProductOptionDto {
    @ApiProperty({ description: 'Thumbnail image URL' })
    @IsNotEmpty()
    @IsString()
    thumbnail: string;

    @ApiProperty({ description: 'Product images', type: [ProductImageDto] })
    @IsNotEmpty()
    @IsArray()
    product_images: ProductImageDto[];

    @ApiPropertyOptional({ description: 'Label image URL' })
    @IsOptional()
    @IsString()
    label_image: string;

    @ApiProperty({ description: 'Price modifier' })
    @IsNotEmpty()
    @IsNumber()
    price_modifier: number;

    @ApiProperty({ description: 'Stock quantity' })
    @IsNotEmpty()
    @IsNumber()
    stock: number;

    @ApiProperty({ description: 'SKU (Stock Keeping Unit)' })
    @IsNotEmpty()
    @IsString()
    sku: string;

    @ApiPropertyOptional({ description: 'Discount percentage' })
    @IsOptional()
    @IsNumber()
    discount: number;

    @ApiPropertyOptional({ description: 'Is on sale' })
    @IsOptional()
    @IsBoolean()
    is_sale: boolean;

    @ApiProperty({ description: 'Product option slug' })
    @IsNotEmpty()
    @IsString()
    slug: string;

    @ApiProperty({ description: 'Technical specifications', type: [TechnicalSpecs] })
    @IsArray()
    technical_specs: TechnicalSpecs[];

    @ApiProperty({ description: 'Product option values', type: [ProductOptionValue] })
    @IsArray()
    product_option_value: ProductOptionValue[];
}

export class CreateProductOptionDto {
    @ApiProperty({ description: 'Product ID' })
    @IsString()
    @IsNotEmpty()
    product_id: string;

    @ApiProperty({ description: 'Product options', type: [ProductOptionDto] })
    @IsArray()
    @IsNotEmpty()
    product_options: ProductOptionDto[];
}
