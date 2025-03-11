import { Pagination } from '@/common/types';

export function formatPagination<T>(
    dataObj: Record<string, T[]>,
    total: number,
    page: number,
    limit: number,
): Pagination<T> {
    return {
        ...dataObj,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1,
        },
    } as Pagination<T>;
}
