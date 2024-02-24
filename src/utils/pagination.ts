import { Request } from 'express';

export const pagination = (request: Request, countRecords: number) => {
    const PAGE_SIZE =
        +request.query['limit'] <= countRecords
            ? +request.query['limit']
            : countRecords;
    const totalPages = +(countRecords / PAGE_SIZE).toFixed();
    const page = +request.query['page'] || 1;
    const skip = (page - 1) * PAGE_SIZE || 0;

    return {
        totalPages,
        page,
        limit: PAGE_SIZE,
        skip,
    };
};
