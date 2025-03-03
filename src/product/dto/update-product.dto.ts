import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { TechnicalSpecs } from 'src/product/dto/create-product.dto';

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    brandId?: string;

    @IsOptional()
    @IsString()
    cateId?: string;

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

    @IsOptional()
    @IsString()
    main_image?: string;
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

    @IsOptional()
    @IsBoolean()
    is_deleted?: boolean;

    @IsArray()
    technical_specs: TechnicalSpecs[];
}

class ProductImageDto {
    @IsNotEmpty()
    @IsString()
    image_url: string;

    @IsOptional()
    @IsString()
    image_alt_text: string;
}
