import { JsonValue } from '@prisma/client/runtime/library';

export interface ProductCartDB {
    product_option: {
        id: string;
        is_sale: boolean;
        price_modifier: number;
        stock: number;
        thumbnail: string;
        sku: string;
        slug: string;
        discount: number;
        label_image: string;
        product_images: {
            id: string;
            image_url: string;
            image_alt_text: string;
        }[];
        product: {
            name: string;
            price: number;
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
            warranties: JsonValue;
        };
        product_option_value: {
            option: {
                name: string;
            };
            value: string;
            adjust_price: number;
        }[];
    };
    quantity: number;
}
