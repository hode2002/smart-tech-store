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
        technical_specs: {
            weight: string;
        };
        product_images: {
            id: string;
            image_url: string;
            image_alt_text: string;
        }[];
        product: {
            id: string;
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
            product_options: {
                id: string;
                price_modifier: number;
                label_image: string;
                is_sale: boolean;
                discount: number;
                technical_specs: {
                    weight: string;
                };
                product_option_value: {
                    option: {
                        name: string;
                    };
                    value: string;
                    adjust_price: number;
                }[];
                product_images: {
                    id: string;
                    image_url: string;
                    image_alt_text: string;
                }[];
                slug: string;
                sku: string;
                stock: number;
                thumbnail: string;
            }[];
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
