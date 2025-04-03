import { Prisma } from '@prisma/client';

export const BRAND_BASIC_SELECT = {
    id: true,
    name: true,
    description: true,
    logo_url: true,
    slug: true,
    status: true,
} as const;

export const BRAND_FULL_SELECT = {
    ...BRAND_BASIC_SELECT,
    deleted_at: true,
    created_at: true,
    updated_at: true,
} as const;

export type BrandBasic = Prisma.BrandGetPayload<{
    select: typeof BRAND_BASIC_SELECT;
}>;

export type BrandFull = Prisma.BrandGetPayload<{
    select: typeof BRAND_FULL_SELECT;
}>;
