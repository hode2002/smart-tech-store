import { ReviewDetail } from '@/prisma/selectors';
import { CreateReplyReviewDto, CreateReviewDto } from '@v2/modules/review/dto';

export interface IReviewCommandService {
    upsertReview(userId: string, createReviewDto: CreateReviewDto): Promise<ReviewDetail>;
    createReply(
        reviewId: string,
        userId: string,
        createReplyReviewDto: CreateReplyReviewDto,
    ): Promise<ReviewDetail>;
    updateReply(
        reviewId: string,
        userId: string,
        createReplyReviewDto: CreateReplyReviewDto,
    ): Promise<ReviewDetail>;
    delete(reviewId: string): Promise<boolean>;
}
