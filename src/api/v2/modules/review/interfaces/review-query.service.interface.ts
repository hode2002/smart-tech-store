import { Pagination } from '@/common/types';
import { ReviewDetail, ReviewWithProduct } from '@/prisma/selectors';

export interface IReviewQueryService {
    findAll(page: number, limit: number): Promise<Pagination<ReviewDetail>>;
    findById(id: string): Promise<ReviewWithProduct>;

    findByProductOptionId(
        productOptionId: string,
        page: number,
        limit: number,
    ): Promise<Pagination<ReviewDetail>>;
    findByParentId(
        parentId: string,
        page: number,
        limit: number,
    ): Promise<Pagination<ReviewDetail>>;
    findUserReview(userId: string, productOptionId: string): Promise<ReviewWithProduct>;

    canReview(productOptionId: string, userId: string): Promise<boolean>;
}
