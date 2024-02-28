import { JsonValue } from '@prisma/client/runtime/library';

export interface ProductCartResponse {
    id: string;
    name: string;
    product_images: {
        id: string;
        image_url: string;
        image_alt_text: string;
    }[];
    is_sale: boolean;
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
    stock: number;
    thumbnail: string;
    sku: string;
    slug: string;
    discount: number;
    label_image: string;
    options: {
        name: string;
        value: string;
        adjust_price: number;
    }[];
    warranties: JsonValue;
    quantity: number;
}
