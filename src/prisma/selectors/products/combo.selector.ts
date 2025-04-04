import { Prisma } from '@prisma/client';

export const COMBO_ITEM_SELECT = {
    id: true,
    variant_id: true,
    quantity: true,
    discount: true,
    discount_type: true,
    variant: {
        select: {
            id: true,
            name: true,
            price: true,
        },
    },
} as const;

export const COMBO_DETAIL_SELECT = {
    id: true,
    name: true,
    slug: true,
    description: true,
    price: true,
    original_price: true,
    discount: true,
    created_at: true,
    updated_at: true,
    deleted_at: true,
    status: true,
    start_date: true,
    end_date: true,
    main_variant: {
        select: {
            id: true,
            name: true,
            price: true,
        },
    },
    items: {
        select: COMBO_ITEM_SELECT,
    },
} as const;

export type ComboDetail = Prisma.ComboGetPayload<{
    select: typeof COMBO_DETAIL_SELECT;
}>;
