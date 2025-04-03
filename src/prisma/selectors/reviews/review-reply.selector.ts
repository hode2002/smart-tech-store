import { Prisma } from '@prisma/client';

export const REVIEW_PARENT_SELECT = {
    user: {
        select: { id: true },
    },
    variant_id: true,
} as const;

export const USER_COMMENT_SELECT = {
    id: true,
    user: {
        select: { id: true },
    },
    variant_id: true,
} as const;

export const REPLY_REVIEW_SELECT = {
    id: true,
    comment: true,
} as const;

export type ReviewParent = Prisma.ReviewGetPayload<{
    select: typeof REVIEW_PARENT_SELECT;
}>;

export type UserComment = Prisma.ReviewGetPayload<{
    select: typeof USER_COMMENT_SELECT;
}>;

export type ReplyReview = Prisma.ReviewGetPayload<{
    select: typeof REPLY_REVIEW_SELECT;
}>;
