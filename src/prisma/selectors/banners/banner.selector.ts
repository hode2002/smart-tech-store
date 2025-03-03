import { Prisma } from '@prisma/client';

export const BANNER_BASIC_SELECT = {
    id: true,
    title: true,
    image: true,
    link: true,
    slug: true,
    status: true,
    type: true,
} as const;

export const BANNER_FULL_SELECT = {
    ...BANNER_BASIC_SELECT,
    created_at: true,
    updated_at: true,
} as const;

export type BannerBasic = Prisma.BannerGetPayload<{
    select: typeof BANNER_BASIC_SELECT;
}>;

export type BannerFull = Prisma.BannerGetPayload<{
    select: typeof BANNER_FULL_SELECT;
}>;
