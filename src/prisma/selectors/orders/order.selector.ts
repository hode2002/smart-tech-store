import { Prisma } from '@prisma/client';

export const ORDER_USER_SELECT = {
    id: true,
    email: true,
    avatar: true,
} as const;

export const ORDER_BRAND_SELECT = {
    id: true,
    name: true,
    slug: true,
    logo_url: true,
} as const;

export const ORDER_CATEGORY_SELECT = {
    id: true,
    name: true,
    slug: true,
} as const;

export const ORDER_DESCRIPTION_SELECT = {
    id: true,
    content: true,
} as const;

export const ORDER_SHIPPING_SELECT = {
    id: true,
    address: true,
    province: true,
    district: true,
    ward: true,
    hamlet: true,
    fee: true,
    estimate_date: true,
    tracking_number: true,
    order_label: true,
    delivery: {
        select: {
            name: true,
            slug: true,
        },
    },
} as const;

export const ORDER_PAYMENT_SELECT = {
    id: true,
    payment_method: true,
    total_price: true,
    transaction_id: true,
} as const;

export const ORDER_PRODUCT_SELECT = {
    id: true,
    name: true,
    brand: {
        select: ORDER_BRAND_SELECT,
    },
    category: {
        select: ORDER_CATEGORY_SELECT,
    },
    descriptions: {
        select: ORDER_DESCRIPTION_SELECT,
    },
    label: true,
    price: true,
    promotions: true,
    warranties: true,
} as const;

export const ORDER_PRODUCT_OPTION_VALUE_SELECT = {
    option: {
        select: {
            name: true,
        },
    },
    value: true,
    adjust_price: true,
} as const;

export const ORDER_PRODUCT_OPTION_SELECT = {
    id: true,
    sku: true,
    product: {
        select: ORDER_PRODUCT_SELECT,
    },
    thumbnail: true,
    product_option_value: {
        select: ORDER_PRODUCT_OPTION_VALUE_SELECT,
    },
    technical_specs: {
        select: {
            specs: {
                where: {
                    key: 'Khối lượng',
                },
                select: {
                    key: true,
                    value: true,
                },
            },
        },
    },
    label_image: true,
    price_modifier: true,
    discount: true,
    slug: true,
} as const;

export const ORDER_DETAIL_SELECT = {
    id: true,
    product_option: {
        select: ORDER_PRODUCT_OPTION_SELECT,
    },
    price: true,
    quantity: true,
    subtotal: true,
} as const;

export const ORDER_BASIC_SELECT = {
    id: true,
    name: true,
    phone: true,
    note: true,
    order_date: true,
    status: true,
    total_amount: true,
} as const;

export const ORDER_FULL_SELECT = {
    ...ORDER_BASIC_SELECT,
    User: {
        select: ORDER_USER_SELECT,
    },
    shipping: {
        select: ORDER_SHIPPING_SELECT,
    },
    payment: {
        select: ORDER_PAYMENT_SELECT,
    },
    order_details: {
        select: ORDER_DETAIL_SELECT,
    },
} as const;

export const ORDER_CANCEL_SELECT = {
    order_details: {
        select: {
            product_option: {
                select: {
                    thumbnail: true,
                },
            },
        },
    },
    user_id: true,
    payment: {
        select: {
            transaction_id: true,
        },
    },
} as const;

export const ORDER_UPDATE_STATUS_SELECT = {
    id: true,
    status: true,
} as const;

export const ORDER_FIND_BY_STATUS_SELECT = {
    ...ORDER_FULL_SELECT,
    orderBy: {
        created_at: 'desc',
    },
} as const;

export type OrderBasic = Prisma.OrderGetPayload<{
    select: typeof ORDER_BASIC_SELECT;
}>;

export type OrderFull = Prisma.OrderGetPayload<{
    select: typeof ORDER_FULL_SELECT;
}>;

export type OrderCancel = Prisma.OrderGetPayload<{
    select: typeof ORDER_CANCEL_SELECT;
}>;

export type OrderUpdateStatus = Prisma.OrderGetPayload<{
    select: typeof ORDER_UPDATE_STATUS_SELECT;
}>;

export type OrderFindByStatus = Prisma.OrderGetPayload<{
    select: typeof ORDER_FIND_BY_STATUS_SELECT;
}>;
