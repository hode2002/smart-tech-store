import {
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsArray()
    descriptions?: Array<ProductDescriptionDto>;

    @IsOptional()
    @IsNumber()
    price?: number;

    @IsOptional()
    @IsArray()
    product_options?: Array<ProductOptionDto>;

    @IsOptional()
    @IsArray()
    promotions?: Array<object>;

    @IsOptional()
    @IsArray()
    warranties?: Array<object>;

    @IsOptional()
    @IsString()
    label?: string;
}

class ProductDescriptionDto {
    @IsNotEmpty()
    @IsString()
    content: string;
}

class ProductOptionDto {
    @IsString()
    @IsOptional()
    id?: string;

    @IsString()
    @IsOptional()
    thumbnail?: string;

    @IsOptional()
    @IsArray()
    product_images?: Array<ProductImageDto>;

    @IsOptional()
    @IsString()
    label_image?: string;

    @IsOptional()
    @IsNumber()
    price_modifier?: number;

    @IsOptional()
    @IsNumber()
    stock?: number;

    @IsOptional()
    @IsNumber()
    discount?: number;

    @IsOptional()
    @IsBoolean()
    is_sale?: boolean;
}

class ProductImageDto {
    @IsNotEmpty()
    @IsString()
    image_url: string;

    @IsOptional()
    @IsString()
    image_alt_text: string;
}
