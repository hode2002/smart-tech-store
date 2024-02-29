import {
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateProductOptionDto {
    @IsString()
    @IsNotEmpty()
    product_id: string;

    @IsArray()
    @IsNotEmpty()
    product_options: Array<ProductOptionDto>;
}

class TechnicalSpecs {
    @IsString()
    @IsOptional()
    screen?: string;

    @IsString()
    @IsOptional()
    screen_size?: string;

    @IsString()
    @IsOptional()
    os?: string;

    @IsString()
    @IsOptional()
    front_camera?: string;

    @IsString()
    @IsOptional()
    rear_camera?: string;

    @IsString()
    @IsOptional()
    chip?: string;

    @IsString()
    @IsOptional()
    ram?: string;

    @IsString()
    @IsOptional()
    rom?: string;

    @IsString()
    @IsOptional()
    sim?: string;

    @IsString()
    @IsOptional()
    battery?: string;

    @IsString()
    @IsOptional()
    connection?: string;

    @IsString()
    @IsOptional()
    weight?: string;
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

    @IsObject()
    technical_specs: TechnicalSpecs;

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
