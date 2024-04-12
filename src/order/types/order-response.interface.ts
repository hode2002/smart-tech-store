import { JsonValue } from '@prisma/client/runtime/library';

export interface OrderResponse {
    id: string;
    name: string;
    phone: string;
    note: string;
    order_date: Date;
    status: number;
    total_amount: number;
    address: string;
    province: string;
    district: string;
    ward: string;
    hamlet: string;
    fee: number;
    estimate_date: string;
    tracking_number: string;
    payment_method: string;
    transaction_id: string;
    order_details: {
        id: string;
        product: {
            id: string;
            sku: string;
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
            weight: number;
            label: string;
            price: number;
            promotions: JsonValue;
            warranties: JsonValue;
            thumbnail: string;
            options: {
                name: string;
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
