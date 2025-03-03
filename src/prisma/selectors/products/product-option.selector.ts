import { Prisma } from '@prisma/client';

export const PRODUCT_OPTION_BASIC_SELECT = {
    id: true,
    sku: true,
    thumbnail: true,
    price_modifier: true,
    stock: true,
    discount: true,
    is_sale: true,
    slug: true,
    label_image: true,
} as const;

export const PRODUCT_OPTION_IMAGE_SELECT = {
    id: true,
    image_url: true,
    image_alt_text: true,
} as const;

export const PRODUCT_OPTION_VALUE_DETAIL_SELECT = {
    id: true,
    value: true,
    adjust_price: true,
} as const;

export const PRODUCT_OPTION_DETAIL_SELECT = {
    ...PRODUCT_OPTION_BASIC_SELECT,
    product_images: {
        select: PRODUCT_OPTION_IMAGE_SELECT,
    },
    technical_specs: true,
    product_option_value: {
        select: PRODUCT_OPTION_VALUE_DETAIL_SELECT,
    },
} as const;

export type ProductOptionDetail = Prisma.ProductOptionGetPayload<{
    select: typeof PRODUCT_OPTION_DETAIL_SELECT;
}>;
