import { Prisma } from '@prisma/client';

export const HISTORY_SEARCH_BASIC_SELECT = {
    id: true,
    search_content: true,
    user_id: true,
} as const;

export const HISTORY_SEARCH_FULL_SELECT = {
    ...HISTORY_SEARCH_BASIC_SELECT,
    updated_at: true,
    created_at: true,
} as const;

export type HistorySearchBasic = Prisma.HistorySearchGetPayload<{
    select: typeof HISTORY_SEARCH_BASIC_SELECT;
}>;

export type HistorySearchFull = Prisma.HistorySearchGetPayload<{
    select: typeof HISTORY_SEARCH_FULL_SELECT;
}>;
