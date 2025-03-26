import { Injectable, NotFoundException, Inject } from '@nestjs/common';

import { Pagination } from '@/common/types';
import { ReviewDetail, ReviewWithProduct } from '@/prisma/selectors';
import { REVIEW_TOKENS } from '@v2/modules/review/constants';
import { IReviewQueryRepository, IReviewQueryService } from '@v2/modules/review/interfaces';

@Injectable()
export class ReviewQueryService implements IReviewQueryService {
    constructor(
        @Inject(REVIEW_TOKENS.REPOSITORIES.QUERY)
        private readonly reviewQueryRepository: IReviewQueryRepository,
    ) {}

    async findAll(page = 1, limit = 10): Promise<Pagination<ReviewDetail>> {
        return this.reviewQueryRepository.findMany(page, limit);
    }

    async findById(id: string): Promise<ReviewWithProduct> {
        const review = this.reviewQueryRepository.findById(id);
        if (!review) {
            throw new NotFoundException('Review not found');
        }
        return review;
    }

    async findByProductOptionId(
        productOptionId: string,
        page = 1,
        limit = 10,
    ): Promise<Pagination<ReviewDetail>> {
        return this.reviewQueryRepository.findByProductOptionId(productOptionId, page, limit);
    }

    async findByParentId(
        parentId: string,
        page = 1,
        limit = 10,
    ): Promise<Pagination<ReviewDetail>> {
        const review = await this.reviewQueryRepository.findById(parentId);
        if (!review) {
            throw new NotFoundException('Review not found');
        }

        return this.reviewQueryRepository.findByParentId(parentId, page, limit);
    }

    async findUserReview(userId: string, productOptionId: string): Promise<ReviewWithProduct> {
        return this.reviewQueryRepository.findUserReview(userId, productOptionId);
    }

    async canReview(productOptionId: string, userId: string): Promise<boolean> {
        const isReviewable = await this.reviewQueryRepository.canReview(productOptionId, userId);
        if (!isReviewable) {
            throw new NotFoundException('Forbidden: Please purchase this product for reviews');
        }
        return true;
    }
}
