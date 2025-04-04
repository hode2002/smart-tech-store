import { ApiProperty } from '@nestjs/swagger';
import { ProductStatus, VariantStatus } from '@prisma/client';
import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
} from 'class-validator';

class SpecItem {
    @ApiProperty({ description: 'Specification key' })
    @IsString()
    @IsNotEmpty()
    key: string;

    @ApiProperty({ description: 'Specification value' })
    @IsString()
    @IsNotEmpty()
    value: string;

    @ApiProperty({ description: 'Specification unit' })
    @IsString()
    @IsNotEmpty()
    unit: string;

    @ApiProperty({ description: 'Specification group' })
    @IsString()
    @IsNotEmpty()
    group: string;

    @ApiProperty({ description: 'Specification display order' })
    @IsNumber()
    @IsNotEmpty()
    display_order: number;
}

class TechnicalSpecs {
    @ApiProperty({ description: 'Specification items', type: [SpecItem] })
    @IsArray()
    @IsNotEmpty()
    items: SpecItem[];
}

class DescriptionDto {
    @ApiProperty({ description: 'Description content' })
    @IsNotEmpty()
    @IsString()
    content: string;
}

class ImageDto {
    @ApiProperty({ description: 'Image URL' })
    @IsNotEmpty()
    @IsString()
    url: string;

    @ApiProperty({ description: 'Image alt text' })
    @IsOptional()
    @IsString()
    alt_text?: string;

    @ApiProperty({ description: 'Image position' })
    @IsNotEmpty()
    @IsNumber()
    position: number;
}

class VariantAttributeDto {
    @ApiProperty({ description: 'Attribute ID' })
    @IsNotEmpty()
    @IsString()
    attribute_id: string;

    @ApiProperty({ description: 'Attribute value' })
    @IsNotEmpty()
    @IsString()
    value: string;
}

class WarrantyDto {
    @ApiProperty({ description: 'Warranty duration' })
    @IsNotEmpty()
    @IsNumber()
    duration: number;

    @ApiProperty({ description: 'Warranty unit' })
    @IsNotEmpty()
    @IsString()
    unit: string;

    @ApiProperty({ description: 'Warranty conditions' })
    @IsNotEmpty()
    @IsString()
    conditions: string;
}

class VariantDto {
    @ApiProperty({ description: 'Variant name' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: 'Variant price' })
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @ApiProperty({ description: 'Variant compare at price' })
    @IsNotEmpty()
    @IsNumber()
    compare_at_price: number;

    @ApiProperty({ description: 'Variant stock' })
    @IsNotEmpty()
    @IsNumber()
    stock_quantity: number;

    @ApiProperty({ description: 'Variant thumbnail' })
    @IsNotEmpty()
    @IsString()
    thumbnail: string;

    @ApiProperty({ description: 'Variant weight' })
    @IsNotEmpty()
    @IsNumber()
    weight: number;

    @ApiProperty({ description: 'Variant SKU' })
    @IsNotEmpty()
    @IsString()
    sku: string;

    @ApiProperty({ description: 'Variant is default' })
    @IsNotEmpty()
    @IsBoolean()
    is_default: boolean;

    @ApiProperty({ description: 'Variant status' })
    @IsNotEmpty()
    @IsEnum(VariantStatus)
    status: VariantStatus;

    @ApiProperty({ description: 'Variant images', type: [ImageDto] })
    @IsNotEmpty()
    @IsArray()
    images: ImageDto[];

    @ApiProperty({ description: 'Variant attributes', type: [VariantAttributeDto] })
    @IsNotEmpty()
    @IsArray()
    attributes: VariantAttributeDto[];

    @ApiProperty({ description: 'Variant technical specs', type: TechnicalSpecs })
    @IsNotEmpty()
    @IsObject()
    technical_specs: TechnicalSpecs;

    @ApiProperty({ description: 'Variant additional specs', type: [String] })
    @IsOptional()
    @IsArray()
    additional_specs?: string;

    @ApiProperty({ description: 'Variant warranties', type: [WarrantyDto] })
    @IsOptional()
    @IsArray()
    warranties?: WarrantyDto[];
}

export class CreateProductDto {
    @ApiProperty({ description: 'Product name' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: 'Main product image URL' })
    @IsNotEmpty()
    @IsString()
    main_image: string;

    @ApiProperty({ description: 'Product images', type: [ImageDto] })
    @IsNotEmpty()
    @IsArray()
    images: ImageDto[];

    @ApiProperty({ description: 'Short description' })
    @IsNotEmpty()
    @IsString()
    short_description: string;

    @ApiProperty({ description: 'Product descriptions', type: [DescriptionDto] })
    @IsNotEmpty()
    @IsArray()
    descriptions: DescriptionDto[];

    @ApiProperty({ description: 'Brand ID' })
    @IsNotEmpty()
    @IsString()
    brand_id: string;

    @ApiProperty({ description: 'Category ID' })
    @IsNotEmpty()
    @IsString()
    category_id: string;

    @ApiProperty({ description: 'Product warranties', type: [WarrantyDto] })
    @IsOptional()
    @IsArray()
    warranties?: WarrantyDto[];

    @ApiProperty({ description: 'Technical specs', type: TechnicalSpecs })
    @IsNotEmpty()
    @IsObject()
    technical_specs: TechnicalSpecs;

    @ApiProperty({ description: 'Additional specs', type: [String] })
    @IsOptional()
    @IsArray()
    additional_specs?: string;

    @ApiProperty({ description: 'Is featured' })
    @IsNotEmpty()
    @IsBoolean()
    is_featured: boolean;

    @ApiProperty({ description: 'Product status' })
    @IsNotEmpty()
    @IsEnum(ProductStatus)
    status: ProductStatus;

    @ApiProperty({ description: 'Product variants', type: [VariantDto] })
    @IsNotEmpty()
    @IsArray()
    variants: VariantDto[];
}

export class CreateVariantDto extends VariantDto {}
