import { Prisma } from '@prisma/client';

export const NEWS_BASIC_SELECT = {
    id: true,
    title: true,
    content: true,
    image: true,
    slug: true,
} as const;

export const NEWS_FULL_SELECT = {
    ...NEWS_BASIC_SELECT,
    updated_at: true,
    created_at: true,
} as const;

export type NewsBasic = Prisma.NewsGetPayload<{
    select: typeof NEWS_BASIC_SELECT;
}>;

export type NewsFull = Prisma.NewsGetPayload<{
    select: typeof NEWS_FULL_SELECT;
}>;
