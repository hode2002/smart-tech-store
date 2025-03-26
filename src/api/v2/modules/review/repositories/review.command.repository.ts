import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { REVIEW_DETAIL_SELECT, ReviewDetail } from '@/prisma/selectors';
import { IReviewCommandRepository } from '@v2/modules/review/interfaces';
import { ReviewCreateInput, ReviewUpdateInput } from '@v2/modules/review/types';

@Injectable()
export class ReviewCommandRepository implements IReviewCommandRepository {
    constructor(private readonly prisma: PrismaService) {}

    async createReview(data: ReviewCreateInput): Promise<ReviewDetail> {
        return this.prisma.review.create({
            data,
            select: REVIEW_DETAIL_SELECT,
        });
    }

    async updateReview(id: string, data: ReviewUpdateInput): Promise<ReviewDetail> {
        return this.prisma.review.update({ where: { id }, data, select: REVIEW_DETAIL_SELECT });
    }

    async deleteReview(id: string) {
        try {
            await this.prisma.review.delete({ where: { id } });
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async createReply(data: ReviewCreateInput) {
        return this.prisma.review.create({ data, select: REVIEW_DETAIL_SELECT });
    }

    async updateReply(id: string, userId: string, comment: string): Promise<ReviewDetail> {
        return this.prisma.review.update({
            where: { id, user_id: userId },
            data: { comment },
            select: REVIEW_DETAIL_SELECT,
        });
    }
}
