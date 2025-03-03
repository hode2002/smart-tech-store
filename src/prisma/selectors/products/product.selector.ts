import { Prisma } from '@prisma/client';

export const PRODUCT_BASIC_SELECT = {
    id: true,
    name: true,
    price: true,
    main_image: true,
    promotions: true,
    warranties: true,
    label: true,
} as const;

export type ProductBasic = Prisma.ProductGetPayload<{
    select: typeof PRODUCT_BASIC_SELECT;
}>;

export const PRODUCT_DESCRIPTION_SELECT = {
    id: true,
    content: true,
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

export const PRODUCT_IMAGE_SELECT = {
    id: true,
    image_url: true,
    image_alt_text: true,
} as const;

export const PRODUCT_TECHNICAL_SPECS_SELECT = {
    specs: {
        select: {
            key: true,
            value: true,
        },
    },
} as const;

export const PRODUCT_OPTION_VALUE_SELECT = {
    option: {
        select: {
            name: true,
        },
    },
    value: true,
    adjust_price: true,
} as const;

export const PRODUCT_REVIEW_USER_SELECT = {
    id: true,
    email: true,
    name: true,
    avatar: true,
} as const;

export const PRODUCT_REVIEW_CHILD_SELECT = {
    id: true,
    user: {
        select: PRODUCT_REVIEW_USER_SELECT,
    },
    comment: true,
    created_at: true,
} as const;

export const PRODUCT_REVIEW_SELECT = {
    id: true,
    user: {
        select: PRODUCT_REVIEW_USER_SELECT,
    },
    star: true,
    comment: true,
    _count: true,
    children: {
        select: PRODUCT_REVIEW_CHILD_SELECT,
    },
    created_at: true,
} as const;

export const PRODUCT_OPTION_SELECT = {
    id: true,
    sku: true,
    thumbnail: true,
    price_modifier: true,
    stock: true,
    discount: true,
    is_sale: true,
    slug: true,
    label_image: true,
    product_images: {
        select: PRODUCT_IMAGE_SELECT,
    },
    technical_specs: {
        select: PRODUCT_TECHNICAL_SPECS_SELECT,
    },
    product_option_value: {
        select: PRODUCT_OPTION_VALUE_SELECT,
    },
    reviews: {
        where: {
            parent_id: null,
        },
        select: PRODUCT_REVIEW_SELECT,
    },
} as const;

export const PRODUCT_DETAIL_SELECT = {
    ...PRODUCT_BASIC_SELECT,
    descriptions: {
        select: PRODUCT_DESCRIPTION_SELECT,
    },
    brand: {
        select: PRODUCT_BRAND_SELECT,
    },
    category: {
        select: PRODUCT_CATEGORY_SELECT,
    },
    product_options: {
        where: { is_deleted: false, stock: { gte: 1 } },
        select: PRODUCT_OPTION_SELECT,
    },
} as const;

export type ProductDetail = Prisma.ProductGetPayload<{
    select: typeof PRODUCT_DETAIL_SELECT;
}>;
