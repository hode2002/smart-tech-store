export type PaginationMeta = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
};

export type Pagination<T> = {
    meta: PaginationMeta;
} & Record<string, T[]>;
