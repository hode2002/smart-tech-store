import { Prisma } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';

export const PRODUCT_OPTION_VALUE_SELECT = {
    option: {
        select: {
            name: true,
        },
    },
    value: true,
    adjust_price: true,
} as const;

export const PRODUCT_OPTION_IMAGE_SELECT = {
    id: true,
    image_url: true,
    image_alt_text: true,
} as const;

export const PRODUCT_TECHNICAL_SPECS_SELECT = {
    specs: {
        where: { key: 'Khối lượng' },
        select: {
            key: true,
            value: true,
        },
    },
} as const;

export const PRODUCT_BRAND_SELECT = {
    id: true,
    name: true,
    logo_url: true,
    slug: true,
} as const;

export const PRODUCT_CATEGORY_SELECT = {
    id: true,
    name: true,
    slug: true,
} as const;

export const PRODUCT_SELECT = {
    id: true,
    name: true,
    price: true,
    brand: {
        select: PRODUCT_BRAND_SELECT,
    },
    category: {
        select: PRODUCT_CATEGORY_SELECT,
    },
    warranties: true,
} as const;

export const OTHER_PRODUCT_OPTIONS_SELECT = {
    id: true,
    price_modifier: true,
    label_image: true,
    is_sale: true,
    discount: true,
    technical_specs: {
        select: PRODUCT_TECHNICAL_SPECS_SELECT,
    },
    product_option_value: {
        select: PRODUCT_OPTION_VALUE_SELECT,
    },
    product_images: {
        select: PRODUCT_OPTION_IMAGE_SELECT,
    },
    slug: true,
    sku: true,
    stock: true,
    thumbnail: true,
} as const;

export const PRODUCT_OPTION_SELECT = {
    id: true,
    is_sale: true,
    price_modifier: true,
    stock: true,
    thumbnail: true,
    sku: true,
    slug: true,
    discount: true,
    label_image: true,
    technical_specs: {
        select: PRODUCT_TECHNICAL_SPECS_SELECT,
    },
    product_images: {
        select: PRODUCT_OPTION_IMAGE_SELECT,
    },
    product: {
        select: {
            ...PRODUCT_SELECT,
            product_options: {
                where: {
                    cart: {
                        none: { user_id: '{userId}' },
                    },
                },
                select: OTHER_PRODUCT_OPTIONS_SELECT,
            },
        },
    },
    product_option_value: {
        select: PRODUCT_OPTION_VALUE_SELECT,
    },
} as const;

export const CART_ITEM_SELECT = {
    product_option: {
        select: PRODUCT_OPTION_SELECT,
    },
    quantity: true,
} as const;

export type ProductCartDB = Prisma.CartGetPayload<{
    select: typeof CART_ITEM_SELECT;
}>;

export type ProductCartResponse = {
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
    selected_option: {
        id: string;
        price_modifier: number;
        label_image: string | null;
        is_sale: boolean;
        discount: number | null;
        options: {
            name: string;
            value: string;
            adjust_price: number;
        }[];
        product_images: {
            id: string;
            image_url: string;
            image_alt_text: string | null;
        }[];
        slug: string;
        sku: string;
        stock: number;
        thumbnail: string;
        weight: number;
    };
    other_product_options: {
        id: string;
        price_modifier: number;
        label_image: string | null;
        is_sale: boolean;
        discount: number | null;
        options: {
            name: string;
            value: string;
            adjust_price: number;
        }[];
        product_images: {
            id: string;
            image_url: string;
            image_alt_text: string | null;
        }[];
        slug: string;
        sku: string;
        stock: number;
        thumbnail: string;
        weight: number;
    }[];
    quantity: number;
};

export type CartProductOptionResponse = {
    id: string;
    price_modifier: number;
    label_image: string | null;
    is_sale: boolean;
    discount: number | null;
    product_option_value: Array<{
        option: {
            name: string;
        };
        value: string;
        adjust_price: number;
    }>;
    product_images: Array<{
        id: string;
        image_url: string;
        image_alt_text: string | null;
    }>;
    slug: string;
    sku: string;
    stock: number;
    thumbnail: string;
    technical_specs?: {
        specs?: Array<{
            value?: string;
        }>;
    };
};
