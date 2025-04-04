import { ComboStatus, DiscountType, VariantStatus } from '@prisma/client';
import { Expose, Transform, Type } from 'class-transformer';

class ImageDto {
    @Expose()
    id: string;

    @Expose()
    url: string;

    @Expose()
    alt_text: string;

    @Expose()
    position: number;
}

class DescriptionDto {
    @Expose()
    id: string;

    @Expose()
    content: string;
}

class BrandDto {
    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    logo_url: string;

    @Expose()
    slug: string;
}

class CategoryDto {
    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    slug: string;
}

class PromotionDto {
    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    description: string;

    @Expose()
    discount_type: DiscountType;

    @Expose()
    discount_value: number;
}

class WarrantyDto {
    @Expose()
    id: string;

    @Expose()
    duration: number;

    @Expose()
    unit: string;

    @Expose()
    conditions: string;
}

class SpecsDto {
    @Expose()
    key: string;

    @Expose()
    value: string;
}

class TechnicalSpecDto {
    @Expose()
    @Type(() => SpecsDto)
    specs: SpecsDto[];
}

class UserDto {
    @Expose()
    id: string;

    @Expose()
    email: string;

    @Expose()
    name: string;

    @Expose()
    avatar: string;
}

class ReviewImageDto {
    @Expose()
    review_id: string;

    @Expose()
    url: string;
}

class ReviewDto {
    @Expose()
    id: string;

    @Expose()
    user: UserDto;

    @Expose()
    rating: number;

    @Expose()
    comment: string;

    @Expose()
    video_url?: string;

    @Expose()
    @Type(() => ReviewImageDto)
    images?: ReviewImageDto[];

    @Expose()
    parent_id?: string;

    @Expose()
    children?: ReviewDto[];

    @Expose()
    _count: {
        children: number;
    };

    @Expose()
    created_at: Date;
}

class AttributeDto {
    @Expose()
    variant_id: string;

    @Expose()
    attribute_id: string;

    @Expose()
    value: string;
}

class ComboDto {
    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    slug: string;

    @Expose()
    description: string;

    @Expose()
    main_variant_id: string;

    @Expose()
    price: number;

    @Expose()
    original_price: number;

    @Expose()
    discount: number;

    @Expose()
    status: ComboStatus;

    @Expose()
    start_date: Date;

    @Expose()
    end_date: Date;

    @Expose()
    @Type(() => VariantDto)
    main_variant: VariantDto;
}

class RatingDto {
    @Expose()
    total_reviews: number;

    @Expose()
    overall: number;

    @Expose()
    details: number[];
}

class VariantDto {
    @Expose()
    id: string;

    @Expose()
    sku: string;

    @Expose()
    thumbnail: string;

    @Expose()
    price: number;

    @Expose()
    compare_at_price: number;

    @Expose()
    stock_quantity: number;

    @Expose()
    weight: number;

    @Expose()
    discount: number;

    @Expose()
    is_featured: boolean;

    @Expose()
    slug: string;

    @Expose()
    created_at?: Date;

    @Expose()
    @Transform(({ value }) => value.toISOString())
    updated_at?: Date;

    @Expose()
    @Transform(({ value }) => value.toISOString())
    deleted_at?: Date;

    @Expose()
    status: VariantStatus;

    @Expose()
    is_default: boolean;

    @Expose()
    @Type(() => ImageDto)
    images: ImageDto[];

    @Expose()
    @Type(() => TechnicalSpecDto)
    technical_specs: TechnicalSpecDto;

    @Expose()
    @Type(() => WarrantyDto)
    warranties: WarrantyDto[];

    @Expose()
    additional_specs?: string;

    @Expose()
    @Type(() => AttributeDto)
    attributes: AttributeDto[];

    @Expose()
    @Type(() => RatingDto)
    rating?: RatingDto;

    @Expose()
    @Type(() => ReviewDto)
    reviews: ReviewDto[];

    @Expose()
    @Type(() => ComboDto)
    combos: ComboDto[];
}

class ProductDto {
    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    main_image: string;

    @Expose()
    slug: string;

    @Expose()
    short_description: string;

    @Expose()
    @Type(() => DescriptionDto)
    descriptions: DescriptionDto[];

    @Expose()
    is_featured: boolean;

    @Expose()
    @Type(() => ImageDto)
    images: ImageDto[];

    @Expose()
    @Type(() => PromotionDto)
    promotions: PromotionDto[];

    @Expose()
    @Type(() => WarrantyDto)
    warranties: WarrantyDto[];

    @Expose()
    @Type(() => BrandDto)
    brand: BrandDto;

    @Expose()
    @Type(() => CategoryDto)
    category: CategoryDto;

    @Expose()
    created_at?: Date;
}

export class ResponseProductDto {
    @Expose()
    @Type(() => ProductDto)
    product: ProductDto;

    @Expose()
    @Type(() => VariantDto)
    variants: VariantDto[];
}

// class VariantDto {
//     @Expose()
//     id: string;

//     @Expose()
//     sku: string;

//     @Expose()
//     thumbnail: string;

//     @Expose()
//     price_modifier: number;

//     @Expose()
//     stock: number;

//     @Expose()
//     discount: number;

//     @Expose()
//     is_sale: boolean;

//     @Expose()
//     slug: string;

//     @Expose()
//     label_image: string;

//     @Expose()
//     is_deleted?: boolean;

//     @Expose()
//     created_at?: Date;

//     @Expose()
//     product_images: {
//         id: string;
//         image_url: string;
//         image_alt_text: string;
//     }[];

//     @Expose()
//     technical_specs: {
//         name: string;
//         value: string;
//     }[];

//     @Expose()
//     options: {
//         name: string;
//         value: string;
//         adjust_price: number;
//     }[];

//     @Expose()
//     rating: {
//         total_reviews: number;
//         overall: number;
//         details: number[];
//     };

//     @Expose()
//     reviews: {
//         id: string;
//         user: {
//             id: string;
//             email: string;
//             name: string;
//             avatar: string;
//         };
//         star: number;
//         comment: string;
//         video_url?: string;
//         review_images?: {
//             image_url: string;
//         }[];
//         created_at: Date;
//         children: {
//             id: string;
//             user: {
//                 id: string;
//                 email: string;
//                 name: string;
//                 avatar: string;
//             };
//             comment: string;
//             created_at: Date;
//         }[];
//     }[];
//     combos?: {
//         product_combos: {
//             discount: number;
//             product_option: {
//                 product: {
//                     name: string;
//                     price: number;
//                     category: {
//                         slug: string;
//                     };
//                 };
//                 sku: string;
//                 price_modifier: number;
//                 thumbnail: string;
//                 slug: string;
//             };
//         }[];
//     }[];
// }

// class ResponseProductDto {
//     @Expose()
//     id: string;

//     @Expose()
//     name: string;

//     @Expose()
//     main_image: string;

//     @Expose()
//     price: number;

//     @Expose()
//     promotions: string;

//     @Expose()
//     warranties: string;

//     @Expose()
//     descriptions: DescriptionDto[];

//     @Expose()
//     brand: BrandDto;

//     @Expose()
//     category: CategoryDto;

//     @Expose()
//     @Transform(({ value }) => value.toISOString())
//     created_at?: Date;

//     @Expose()
//     @Type(() => VariantDto)
//     variants: VariantDto[];

//     @Expose()
//     @Type(() => AttributeDto)
//     attributes: AttributeDto[];
// }
