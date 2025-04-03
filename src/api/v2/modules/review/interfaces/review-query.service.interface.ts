import { Pagination } from '@/common/types';
import { ReviewDetail, ReviewWithProduct } from '@/prisma/selectors';

export interface IReviewQueryService {
    findAll(page: number, limit: number): Promise<Pagination<ReviewDetail>>;
    findById(id: string): Promise<ReviewWithProduct>;

    findByVariantId(
        variantId: string,
        page: number,
        limit: number,
    ): Promise<Pagination<ReviewDetail>>;
    findByParentId(
        parentId: string,
        page: number,
        limit: number,
    ): Promise<Pagination<ReviewDetail>>;
    findUserReview(userId: string, variantId: string): Promise<ReviewWithProduct>;

    canReview(variantId: string, userId: string): Promise<boolean>;
}
