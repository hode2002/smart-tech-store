import { Prisma } from '@prisma/client';

export const ORDER_PRODUCT_OPTION_BASIC_SELECT = {
    id: true,
    sku: true,
    thumbnail: true,
    stock: true,
    discount: true,
    price_modifier: true,
} as const;

export const ORDER_PRODUCT_OPTION_WITH_PRODUCT_SELECT = {
    ...ORDER_PRODUCT_OPTION_BASIC_SELECT,
    product: {
        select: {
            id: true,
            name: true,
            price: true,
        },
    },
} as const;

export const ORDER_PRODUCT_OPTION_WITH_SPECS_SELECT = {
    ...ORDER_PRODUCT_OPTION_WITH_PRODUCT_SELECT,
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
} as const;

export type OrderProductOptionBasic = Prisma.ProductOptionGetPayload<{
    select: typeof ORDER_PRODUCT_OPTION_BASIC_SELECT;
}>;

export type OrderProductOptionWithProduct = Prisma.ProductOptionGetPayload<{
    select: typeof ORDER_PRODUCT_OPTION_WITH_PRODUCT_SELECT;
}>;

export type OrderProductOptionWithSpecs = Prisma.ProductOptionGetPayload<{
    select: typeof ORDER_PRODUCT_OPTION_WITH_SPECS_SELECT;
}>;
