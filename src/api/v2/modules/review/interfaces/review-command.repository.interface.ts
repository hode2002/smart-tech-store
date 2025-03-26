import { ReviewDetail } from '@/prisma/selectors';
import { ReviewCreateInput, ReviewUpdateInput } from '@v2/modules/review/types';

export interface IReviewCommandRepository {
    createReview(data: ReviewCreateInput): Promise<ReviewDetail>;
    updateReview(id: string, data: ReviewUpdateInput): Promise<ReviewDetail>;
    deleteReview(id: string): Promise<boolean>;
    createReply(data: ReviewCreateInput): Promise<ReviewDetail>;
    updateReply(id: string, userId: string, comment: string): Promise<ReviewDetail>;
}
