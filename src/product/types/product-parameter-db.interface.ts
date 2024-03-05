import { JsonValue } from '@prisma/client/runtime/library';
export interface ProductParameterDB {
    id: string;
    product_option_id: string;
    screen: string;
    screen_size: string;
    os: string;
    front_camera: string;
    rear_camera: string;
    chip: string;
    ram: string;
    rom: string;
    sim: string;
    battery: string;
    connection: string;
    weight: string;
    other_info: JsonValue;
    created_at: Date;
    updated_at: Date;
    product_option: {
        id: string;
        product_id: string;
        thumbnail: string;
        label_image: string;
        price_modifier: number;
        stock: number;
        sku: string;
        discount: number;
        is_sale: boolean;
        is_deleted: boolean;
        slug: string;
        created_at: Date;
        updated_at: Date;
        product: {
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
        };
        product_images: {
            id: string;
            image_url: string;
            image_alt_text: string;
        }[];
        product_option_value: {
            option: {
                name: string;
            };
            value: string;
            adjust_price: number;
        }[];
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
            _count: {
                children: number;
            };
            created_at: Date;
        }[];
    };
}
