import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { TechnicalSpecs } from 'src/product/dto/create-product.dto';

export class CreateProductOptionDto {
    @IsString()
    @IsNotEmpty()
    product_id: string;

    @IsArray()
    @IsNotEmpty()
    product_options: Array<ProductOptionDto>;
}

class ProductOptionDto {
    @IsNotEmpty()
    @IsString()
    thumbnail: string;

    @IsNotEmpty()
    @IsArray()
    product_images: Array<ProductImageDto>;

    @IsOptional()
    @IsString()
    label_image: string;

    @IsNotEmpty()
    @IsNumber()
    price_modifier: number;

    @IsNotEmpty()
    @IsNumber()
    stock: number;

    @IsNotEmpty()
    @IsString()
    sku: string;

    @IsOptional()
    @IsNumber()
    discount: number;

    @IsOptional()
    @IsBoolean()
    is_sale: boolean;

    @IsNotEmpty()
    @IsString()
    slug: string;

    @IsArray()
    technical_specs: TechnicalSpecs[];

    @IsArray()
    product_option_value: Array<ProductOptionValue>;
}

class ProductOptionValue {
    @IsNotEmpty()
    @IsString()
    option_id: string;

    @IsNotEmpty()
    @IsString()
    value: string;

    @IsNotEmpty()
    @IsNumber()
    adjust_price: number;
}

class ProductImageDto {
    @IsNotEmpty()
    @IsString()
    image_url: string;

    @IsOptional()
    @IsString()
    image_alt_text: string;
}
