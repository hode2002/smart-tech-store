import { Prisma } from '@prisma/client';

export const USER_SELECT_FIELDS = {
    id: true,
    email: true,
    name: true,
    avatar: true,
    phone: true,
} as const;

export type UserBasicInfo = Prisma.UserGetPayload<{
    select: typeof USER_SELECT_FIELDS;
}>;

export const USER_PROFILE_SELECT = {
    ...USER_SELECT_FIELDS,
    role: true,
} as const;

export type UserProfile = Prisma.UserGetPayload<{
    select: typeof USER_PROFILE_SELECT;
}>;

export const USER_WITH_ADDRESS_SELECT = {
    ...USER_SELECT_FIELDS,
    is_active: true,
    created_at: true,
    address: {
        select: {
            province: true,
            district: true,
            ward: true,
            address: true,
            hamlet: true,
        },
    },
} as const;

export type UserWithAddress = Prisma.UserGetPayload<{
    select: typeof USER_WITH_ADDRESS_SELECT;
}>;

export const USER_ADDRESS_SELECT = {
    address: true,
    province: true,
    district: true,
    ward: true,
    hamlet: true,
} as const;

export type UserAddress = Prisma.UserAddressGetPayload<{
    select: typeof USER_ADDRESS_SELECT;
}>;
