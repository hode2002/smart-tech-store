import { JsonValue } from '@prisma/client/runtime/library';

interface ProductOption {
    id: string;
    product_images: {
        id: string;
        image_url: string;
        image_alt_text: string;
    }[];
    price_modifier: number;
    label_image: string;
    weight: number;
    is_sale: boolean;
    discount: number;
    options: {
        name: string;
        value: string;
        adjust_price: number;
    }[];
    slug: string;
    sku: string;
    stock: number;
    thumbnail: string;
}
export interface ProductCartResponse {
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
    selected_option: ProductOption;
    other_product_options: ProductOption[];
    quantity: number;
}
