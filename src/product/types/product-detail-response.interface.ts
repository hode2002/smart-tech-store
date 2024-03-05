import { JsonValue } from '@prisma/client/runtime/library';

export interface ProductDetailResponse {
    id: string;
    name: string;
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
    product_options: {
        id: string;
        sku: string;
        thumbnail: string;
        price_modifier: number;
        stock: number;
        discount: number;
        is_sale: boolean;
        slug: string;
        label_image: string;
        product_images: {
            id: string;
            image_url: string;
            image_alt_text: string;
        }[];
        technical_specs: {
            name: string;
            value: string;
        }[];
        options: {
            name: string;
            value: string;
            adjust_price: number;
        }[];
        rating: {
            total_reviews: number;
            overall: number;
            details: number[];
        };
        reviews: {
            id: string;
            user: {
                id: string;
                email: string;
                name: string;
                avatar: string;
            };
            star: number;
            comment: string;
            created_at: Date;
            children: {
                user: {
                    id: string;
                    email: string;
                    name: string;
                    avatar: string;
                };
                comment: string;
                created_at: Date;
            }[];
        }[];
    }[];
}
