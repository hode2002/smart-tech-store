import { Prisma } from '@prisma/client';

export const COMBO_PRODUCT_OPTION_SELECT = {
    thumbnail: true,
    price_modifier: true,
    stock: true,
    sku: true,
    discount: true,
    slug: true,
    product: {
        select: {
            id: true,
            name: true,
            price: true,
        },
    },
} as const;

export const COMBO_PRODUCT_OPTION_DETAIL_SELECT = {
    id: true,
    thumbnail: true,
    price_modifier: true,
    stock: true,
    sku: true,
    discount: true,
    slug: true,
    product: {
        select: {
            id: true,
            name: true,
            price: true,
        },
    },
} as const;

export const PRODUCT_COMBO_SELECT = {
    id: true,
    discount: true,
    product_option: {
        select: COMBO_PRODUCT_OPTION_DETAIL_SELECT,
    },
} as const;

export const COMBO_DETAIL_SELECT = {
    id: true,
    created_at: true,
    status: true,
    product_option: {
        select: COMBO_PRODUCT_OPTION_SELECT,
    },
    product_combos: {
        select: PRODUCT_COMBO_SELECT,
    },
} as const;

export type ComboDetail = Prisma.ComboGetPayload<{
    select: typeof COMBO_DETAIL_SELECT;
}>;
