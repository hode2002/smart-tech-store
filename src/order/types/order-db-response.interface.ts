import { JsonValue } from '@prisma/client/runtime/library';

export interface OrderDBResponse {
    id: string;
    name: string;
    phone: string;
    note: string;
    order_date: Date;
    status: number;
    total_amount: number;
    User: {
        email: string;
        avatar: string;
    };
    shipping: {
        id: string;
        address: string;
        province: string;
        district: string;
        ward: string;
        hamlet: string;
        fee: number;
        estimate_date: string;
        tracking_number: string;
        delivery: {
            name: string;
            slug: string;
        };
    };
    payment: {
        id: string;
        payment_method: string;
        total_price: number;
        transaction_id: string;
    };
    order_details: {
        id: string;
        product_option: {
            id: string;
            sku: string;
            technical_specs: {
                specs: { value: string }[];
            };
            product: {
                id: string;
                name: string;
                brand: {
                    id: string;
                    name: string;
                    slug: string;
                    logo_url: string;
                };
                category: {
                    id: string;
                    name: string;
                    slug: string;
                };
                descriptions: {
                    id: string;
                    content: string;
                }[];
                label: string;
                price: number;
                promotions: JsonValue;
                warranties: JsonValue;
            };
            thumbnail: string;
            product_option_value: {
                option: {
                    name: string;
                };
                value: string;
                adjust_price: number;
            }[];
            label_image: string;
            price_modifier: number;
            discount: number;
            slug: string;
        };
        price: number;
        quantity: number;
        subtotal: number;
    }[];
}
