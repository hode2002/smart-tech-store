import { Prisma } from '@prisma/client';

export const REVIEW_USER_SELECT = {
    id: true,
    name: true,
    email: true,
    avatar: true,
} as const;

export const REVIEW_USER_WITH_ROLE_SELECT = {
    ...REVIEW_USER_SELECT,
    role: true,
} as const;

export const REVIEW_PRODUCT_OPTION_SELECT = {
    id: true,
    sku: true,
    thumbnail: true,
    product: {
        select: {
            id: true,
            name: true,
        },
    },
} as const;

export const REVIEW_IMAGE_SELECT = {
    image_url: true,
} as const;

export const REVIEW_CHILD_SELECT = {
    id: true,
    user: {
        select: REVIEW_USER_SELECT,
    },
    comment: true,
    _count: true,
} as const;

export const REVIEW_CHILD_WITH_ROLE_SELECT = {
    id: true,
    user: {
        select: REVIEW_USER_WITH_ROLE_SELECT,
    },
    comment: true,
    _count: true,
} as const;

export const REVIEW_BASIC_SELECT = {
    id: true,
    user: {
        select: REVIEW_USER_SELECT,
    },
    star: true,
    comment: true,
    _count: true,
    created_at: true,
} as const;

export const REVIEW_DETAIL_SELECT = {
    ...REVIEW_BASIC_SELECT,
    video_url: true,
    review_images: {
        select: REVIEW_IMAGE_SELECT,
    },
    children: {
        select: REVIEW_CHILD_SELECT,
    },
} as const;

export const REVIEW_WITH_PRODUCT_SELECT = {
    ...REVIEW_DETAIL_SELECT,
    product_option: {
        select: REVIEW_PRODUCT_OPTION_SELECT,
    },
} as const;

export const REVIEW_UPDATE_SELECT = {
    id: true,
    star: true,
    comment: true,
    video_url: true,
    review_images: {
        select: REVIEW_IMAGE_SELECT,
    },
} as const;

export const REVIEW_DELETE_SELECT = {
    id: true,
    user: {
        select: { id: true },
    },
    star: true,
    parent_id: true,
    product_option_id: true,
    video_url: true,
    review_images: {
        select: REVIEW_IMAGE_SELECT,
    },
} as const;

export type ReviewDetail = Prisma.ReviewGetPayload<{
    select: typeof REVIEW_DETAIL_SELECT;
}>;

export type ReviewWithProduct = Prisma.ReviewGetPayload<{
    select: typeof REVIEW_WITH_PRODUCT_SELECT;
}>;
