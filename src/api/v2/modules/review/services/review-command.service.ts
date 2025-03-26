import { Injectable, NotFoundException, Inject } from '@nestjs/common';

import { ReviewDetail } from '@/prisma/selectors';
import { REVIEW_TOKENS } from '@v2/modules/review/constants';
import { CreateReplyReviewDto, CreateReviewDto } from '@v2/modules/review/dto';
import {
    IReviewMediaService,
    IReviewCommandService,
    IReviewCommandRepository,
    IReviewQueryService,
} from '@v2/modules/review/interfaces';
import { USER_TOKENS } from '@v2/modules/user/constants';
import { UserQueryService } from '@v2/modules/user/services/user-query.service';

@Injectable()
export class ReviewCommandService implements IReviewCommandService {
    constructor(
        @Inject(REVIEW_TOKENS.REPOSITORIES.COMMAND)
        private readonly reviewCommandRepository: IReviewCommandRepository,
        @Inject(REVIEW_TOKENS.SERVICES.QUERY)
        private readonly reviewQueryService: IReviewQueryService,
        @Inject(REVIEW_TOKENS.SERVICES.MEDIA)
        private readonly reviewMediaService: IReviewMediaService,
        @Inject(USER_TOKENS.SERVICES.USER_QUERY_SERVICE)
        private readonly userQueryService: UserQueryService,
    ) {}

    private async createNewReview(
        userId: string,
        createReviewDto: CreateReviewDto,
    ): Promise<ReviewDetail> {
        const { images, video_url, star, comment } = createReviewDto;
        const reviewImages = images.map(url => ({ image_url: url }));

        return this.reviewCommandRepository.createReview({
            star,
            comment,
            video_url,
            review_images: {
                createMany: {
                    data: reviewImages,
                },
            },
            user: {
                connect: { id: userId },
            },
            product_option: {
                connect: { id: createReviewDto.product_option_id },
            },
        });
    }

    private async updateExistingReview(
        review: ReviewDetail,
        createReviewDto: CreateReviewDto,
    ): Promise<ReviewDetail> {
        const { video_url, images, star, comment } = createReviewDto;
        const { id } = review;

        if (video_url && review?.video_url) {
            await this.reviewMediaService.delete(review.video_url);
        }

        if (images && images?.length > 0) {
            const imageToDeletedPromises = review.review_images.map(item => {
                this.reviewMediaService.delete(item.image_url);
            });

            const createImagesPromise = this.reviewCommandRepository.updateReview(id, {
                review_images: {
                    deleteMany: { review_id: id },
                    createMany: {
                        data: images.map(url => ({ image_url: url })),
                    },
                },
            });

            await Promise.all([...imageToDeletedPromises, createImagesPromise]);
        }

        return this.reviewCommandRepository.updateReview(id, {
            star,
            comment,
            video_url,
        });
    }

    async upsertReview(userId: string, createReviewDto: CreateReviewDto) {
        const user = await this.userQueryService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const { product_option_id } = createReviewDto;

        const [, review] = await Promise.all([
            this.reviewQueryService.canReview(product_option_id, userId),
            this.reviewQueryService.findUserReview(userId, product_option_id),
        ]);

        if (review) {
            return this.updateExistingReview(review, createReviewDto);
        }

        return this.createNewReview(userId, createReviewDto);
    }

    async createReply(
        reviewId: string,
        userId: string,
        createReplyReviewDto: CreateReplyReviewDto,
    ): Promise<ReviewDetail> {
        const user = await this.userQueryService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const review = await this.reviewQueryService.findById(reviewId);
        return this.reviewCommandRepository.createReply({
            user: {
                connect: { id: userId },
            },
            product_option: {
                connect: { id: review.product_option.id },
            },
            parent: {
                connect: { id: reviewId },
            },
            comment: createReplyReviewDto.comment,
        });
    }

    async updateReply(
        reviewId: string,
        userId: string,
        createReplyReviewDto: CreateReplyReviewDto,
    ): Promise<ReviewDetail> {
        const user = await this.userQueryService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        return this.reviewCommandRepository.updateReply(
            reviewId,
            userId,
            createReplyReviewDto.comment,
        );
    }

    async delete(reviewId: string): Promise<boolean> {
        const review = await this.reviewQueryService.findById(reviewId);
        if (!review) {
            throw new NotFoundException('Reviews not found');
        }
        return this.reviewCommandRepository.deleteReview(review.id);
    }
}
