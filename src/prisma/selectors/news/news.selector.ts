import { Prisma } from '@prisma/client';

export const NEWS_BASIC_SELECT = {
    id: true,
    title: true,
    content: true,
    thumbnail: true,
    slug: true,
    view_count: true,
    category_id: true,
    status: true,
    published_at: true,
} as const;

export const NEWS_FULL_SELECT = {
    ...NEWS_BASIC_SELECT,
    deleted_at: true,
    updated_at: true,
    created_at: true,
} as const;

export const NEWS_BASIC_SELECT_WITH_CATEGORY = {
    ...NEWS_BASIC_SELECT,
    category: {
        select: {
            id: true,
            name: true,
        },
    },
} as const;

export const NEWS_FULL_SELECT_WITH_CATEGORY = {
    ...NEWS_FULL_SELECT,
    category: {
        select: {
            id: true,
            name: true,
        },
    },
} as const;

export type NewsBasic = Prisma.NewsGetPayload<{
    select: typeof NEWS_BASIC_SELECT;
}>;

export type NewsFull = Prisma.NewsGetPayload<{
    select: typeof NEWS_FULL_SELECT;
}>;

export type NewsBasicWithCategory = Prisma.NewsGetPayload<{
    select: typeof NEWS_BASIC_SELECT_WITH_CATEGORY;
}>;

export type NewsFullWithCategory = Prisma.NewsGetPayload<{
    select: typeof NEWS_FULL_SELECT_WITH_CATEGORY;
}>;
