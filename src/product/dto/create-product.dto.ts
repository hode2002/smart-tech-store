import {
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateProductDto {
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

    @IsNotEmpty()
    @IsNumber()
    brand_id: number;

    @IsNotEmpty()
    @IsNumber()
    category_id: number;

    @IsNotEmpty()
    @IsArray()
    promotions: Array<object>;

    @IsNotEmpty()
    @IsArray()
    warranties: Array<object>;

    @IsNotEmpty()
    @IsString()
    label: string;
}

class ProductDescriptionDto {
    @IsNotEmpty()
    @IsNumber()
    product_id: number;

    @IsNotEmpty()
    @IsString()
    content: string;
}

class ProductOptionDto {
    @IsNotEmpty()
    @IsString()
    product_id: number;

    @IsNotEmpty()
    @IsString()
    thumbnail: string;

    @IsNotEmpty()
    @IsArray()
    product_images: ProductImageDto[];

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
    SKU: string;

    @IsOptional()
    @IsNumber()
    discount: number;

    @IsOptional()
    @IsBoolean()
    is_sale: boolean;

    @IsNotEmpty()
    @IsString()
    slug: string;

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
