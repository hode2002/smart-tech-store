import { Prisma } from '@prisma/client';

export const CATEGORY_BASIC_SELECT = {
    id: true,
    name: true,
    description: true,
    slug: true,
    image: true,
    status: true,
} as const;

export const CATEGORY_FULL_SELECT = {
    ...CATEGORY_BASIC_SELECT,
    deleted_at: true,
    created_at: true,
    updated_at: true,
} as const;

export type CategoryBasic = Prisma.CategoryGetPayload<{
    select: typeof CATEGORY_BASIC_SELECT;
}>;

export type CategoryFull = Prisma.CategoryGetPayload<{
    select: typeof CATEGORY_FULL_SELECT;
}>;
