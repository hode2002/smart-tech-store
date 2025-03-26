import { Pagination } from '@/common/types';
import { ReviewDetail, ReviewWithProduct } from '@/prisma/selectors';
import { ReviewFindFirstArgs, ReviewWhereInput } from '@v2/modules/review/types';

export interface IReviewQueryRepository {
    findById(id: string): Promise<ReviewWithProduct>;
    findFirst(args: ReviewFindFirstArgs): Promise<any>;
    findMany(
        page: number,
        limit: number,
        where?: ReviewWhereInput,
    ): Promise<Pagination<ReviewDetail>>;

    findUserReviewById(reviewId: string, userId: string): Promise<ReviewDetail>;
    findUserReview(userId: string, productOptionId: string): Promise<ReviewWithProduct>;
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

    canReview(productOptionId: string, userId: string): Promise<boolean>;
}
