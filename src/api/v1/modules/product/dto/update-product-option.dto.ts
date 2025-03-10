import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { TechnicalSpecs } from '@v1/modules/product/dto/create-product.dto';

export class UpdateProductOptionDto {
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
