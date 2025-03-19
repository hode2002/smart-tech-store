import { Prisma } from '@prisma/client';

export const DELIVERY_BASIC_SELECT = {
    id: true,
    name: true,
    slug: true,
} as const;

export const DELIVERY_FULL_SELECT = {
    ...DELIVERY_BASIC_SELECT,
    status: true,
    created_at: true,
    updated_at: true,
} as const;

export type DeliveryBasic = Prisma.DeliveryGetPayload<{
    select: typeof DELIVERY_BASIC_SELECT;
}>;

export type DeliveryFull = Prisma.DeliveryGetPayload<{
    select: typeof DELIVERY_FULL_SELECT;
}>;
