import { Prisma } from '@prisma/client';

export const VOUCHER_BASIC_SELECT = {
    id: true,
    code: true,
    type: true,
    value: true,
    min_order_value: true,
    start_date: true,
    end_date: true,
    available_quantity: true,
    status: true,
    created_at: true,
    updated_at: true,
} as const;

export const VOUCHER_ORDER_SELECT = {
    ...VOUCHER_BASIC_SELECT,
    order_vouchers: {
        select: {
            id: true,
            order_id: true,
        },
    },
} as const;

export const VOUCHER_CHECK_SELECT = {
    id: true,
    code: true,
    type: true,
    value: true,
    min_order_value: true,
    max_discount_value: true,
    start_date: true,
    end_date: true,
    available_quantity: true,
    status: true,
} as const;

export const VOUCHER_APPLY_SELECT = {
    id: true,
    code: true,
    type: true,
    value: true,
    min_order_value: true,
    max_discount_value: true,
    available_quantity: true,
} as const;

export const VOUCHER_UPDATE_SELECT = {
    id: true,
    code: true,
    name: true,
    description: true,
    type: true,
    value: true,
    min_order_value: true,
    max_discount_value: true,
    start_date: true,
    end_date: true,
    available_quantity: true,
    status: true,
} as const;

export type VoucherBasic = Prisma.VoucherGetPayload<{
    select: typeof VOUCHER_BASIC_SELECT;
}>;

export type VoucherOrder = Prisma.VoucherGetPayload<{
    select: typeof VOUCHER_ORDER_SELECT;
}>;

export type VoucherCheck = Prisma.VoucherGetPayload<{
    select: typeof VOUCHER_CHECK_SELECT;
}>;

export type VoucherApply = Prisma.VoucherGetPayload<{
    select: typeof VOUCHER_APPLY_SELECT;
}>;

export type VoucherUpdate = Prisma.VoucherGetPayload<{
    select: typeof VOUCHER_UPDATE_SELECT;
}>;
