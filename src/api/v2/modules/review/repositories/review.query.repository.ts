import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';

import { formatPagination } from '@/common/helpers';
import { Pagination } from '@/common/types';
import { PrismaService } from '@/prisma/prisma.service';
import {
    REVIEW_DETAIL_SELECT,
    REVIEW_WITH_PRODUCT_SELECT,
    ReviewDetail,
    ReviewWithProduct,
} from '@/prisma/selectors';
import { IReviewQueryRepository } from '@v2/modules/review/interfaces';
import { ReviewFindFirstArgs, ReviewWhereInput } from '@v2/modules/review/types';

@Injectable()
export class ReviewQueryRepository implements IReviewQueryRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findFirst(args: ReviewFindFirstArgs) {
        return this.prisma.review.findFirst(args);
    }

    async findById(id: string): Promise<ReviewWithProduct> {
        return this.prisma.review.findUnique({
            where: { id },
            select: REVIEW_WITH_PRODUCT_SELECT,
        });
    }

    async findMany(
        page: number,
        limit: number,
        where?: ReviewWhereInput,
    ): Promise<Pagination<ReviewDetail>> {
        const skip = (page - 1) * limit;
        const [reviews, total] = await Promise.all([
            this.prisma.review.findMany({
                where: { parent_id: null, ...where },
                skip,
                take: limit,
                orderBy: { created_at: 'asc' },
                select: REVIEW_DETAIL_SELECT,
            }),
            this.prisma.review.count({ where }),
        ]);
        return formatPagination({ reviews }, total, page, limit);
    }

    async findUserReviewById(reviewId: string, userId: string): Promise<ReviewDetail> {
        return this.prisma.review.findUnique({
            where: { id: reviewId, user_id: userId },
            select: REVIEW_DETAIL_SELECT,
        });
    }

    async findUserReview(userId: string, variantId: string): Promise<ReviewWithProduct> {
        return this.prisma.review.findFirst({
            where: { user_id: userId, variant_id: variantId },
            select: REVIEW_WITH_PRODUCT_SELECT,
        });
    }

    async canReview(variantId: string, userId: string): Promise<boolean> {
        const isReviewable = await this.prisma.order.findFirst({
            where: {
                user_id: userId,
                status: OrderStatus.DELIVERED,
                items: {
                    some: {
                        variant_id: variantId,
                    },
                },
            },
        });

        return isReviewable ? true : false;
    }

    async findByVariantId(
        variantId: string,
        page: number,
        limit: number,
    ): Promise<Pagination<ReviewDetail>> {
        return this.findMany(page, limit, {
            variant_id: variantId,
        });
    }

    async findByParentId(
        parentId: string,
        page: number,
        limit: number,
    ): Promise<Pagination<ReviewDetail>> {
        return this.findMany(page, limit, {
            parent_id: parentId,
        });
    }
}
