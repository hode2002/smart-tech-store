import {
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class UpdateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsArray()
    descriptions: ProductDescriptionDto[];

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsArray()
    product_options: ProductOptionDto[];
}

class ProductDescriptionDto {
    @IsNotEmpty()
    @IsString()
    content: string;
}

class ProductOptionDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsNumber()
    product_id: number;

    @IsNotEmpty()
    @IsString()
    thumbnail: string;

    @IsNotEmpty()
    @IsArray()
    product_images: ProductImageDto[];

    @IsNotEmpty()
    @IsNumber()
    price_modifier: number;

    @IsNotEmpty()
    @IsNumber()
    stock: number;

    @IsNotEmpty()
    @IsNumber()
    discount: number;

    @IsNotEmpty()
    @IsBoolean()
    is_sale: boolean;

    @IsNotEmpty()
    @IsBoolean()
    is_deleted: boolean;

    @IsNotEmpty()
    @IsArray()
    options: OptionsDto[];
}

class OptionsDto {
    @IsNotEmpty()
    @IsNumber()
    product_option_id: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    value: string;

    @IsNotEmpty()
    @IsNumber()
    additional_cost: number;
}

class ProductImageDto {
    @IsNotEmpty()
    @IsNumber()
    product_option_id: number;

    @IsNotEmpty()
    @IsString()
    image_url: string;

    @IsOptional()
    @IsString()
    image_alt_text: string;
}