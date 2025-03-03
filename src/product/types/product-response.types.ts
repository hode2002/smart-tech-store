import { JsonValue } from '@prisma/client/runtime/library';

export interface TechnicalSpec {
    name: string;
    value: string;
}

export interface ProductOption {
    name: string;
    value: string;
    adjust_price: number;
}

export interface ProductRating {
    total_reviews: number;
    details: number[];
    overall: number;
}

export interface ProductReviewUser {
    id: string;
    email: string;
    name: string;
    avatar: string;
}

export interface ProductReviewChild {
    id: string;
    user: ProductReviewUser;
    comment: string;
    created_at: Date;
}

export interface ProductReview {
    id: string;
    user: ProductReviewUser;
    star: number;
    comment: string;
    video_url?: string;
    review_images?: { image_url: string }[];
    created_at: Date;
    children: ProductReviewChild[];
}

export interface ProductImage {
    id: string;
    image_url: string;
    image_alt_text: string;
}

export interface ProductOptionDetail {
    id: string;
    sku: string;
    thumbnail: string;
    price_modifier: number;
    stock: number;
    discount: number;
    is_sale: boolean;
    slug: string;
    label_image: string;
    is_deleted?: boolean;
    created_at?: Date;
    product_images: ProductImage[];
    technical_specs: TechnicalSpec[];
    options: ProductOption[];
    rating: ProductRating;
    reviews: ProductReview[];
    combos?: {
        product_combos: {
            discount: number;
            product_option: {
                product: {
                    name: string;
                    price: number;
                    category: {
                        slug: string;
                    };
                };
                sku: string;
                price_modifier: number;
                thumbnail: string;
                slug: string;
            };
        }[];
    }[];
}

export interface ProductDetailResponse {
    id: string;
    name: string;
    main_image: string;
    price: number;
    promotions: JsonValue;
    warranties: JsonValue;
    label: string;
    descriptions: {
        id: string;
        content: string;
    }[];
    brand: {
        id: string;
        name: string;
        logo_url: string;
        slug: string;
    };
    category: {
        id: string;
        name: string;
        slug: string;
    };
    created_at?: Date;
    product_options: ProductOptionDetail[];
    options: {
        name: string;
        values: string[];
    }[];
}
