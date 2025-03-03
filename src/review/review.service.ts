import { Injectable, NotFoundException } from '@nestjs/common';

import { MediaService } from 'src/media/media.service';
import { OrderStatus } from 'src/order/types';
import { PrismaService } from 'src/prisma/prisma.service';
import {
    REPLY_REVIEW_SELECT,
    REVIEW_DELETE_SELECT,
    REVIEW_DETAIL_SELECT,
    REVIEW_IMAGE_SELECT,
    REVIEW_PARENT_SELECT,
    REVIEW_UPDATE_SELECT,
    REVIEW_WITH_PRODUCT_SELECT,
    USER_COMMENT_SELECT,
} from 'src/prisma/selectors';
import { UserService } from 'src/user/user.service';

import { CreateReplyReviewDto, CreateReviewDto } from './dto';

@Injectable()
export class ReviewService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly userService: UserService,
        private readonly mediaService: MediaService,
    ) {}

    async getAllReviews() {
        return await this.prismaService.review.findMany({
            where: {
                parent_id: null,
            },
            select: REVIEW_WITH_PRODUCT_SELECT,
        });
    }

    async upsertReview(userId: string, createReviewDto: CreateReviewDto) {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const { product_option_id, comment, star } = createReviewDto;

        const product = await this.prismaService.product.findFirst({
            where: {
                product_options: {
                    some: {
                        id: product_option_id,
                        order_detail: {
                            some: {
                                order: {
                                    user_id: userId,
                                    status: OrderStatus.RECEIVED,
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!product) {
            throw new NotFoundException('Forbidden: Please purchase this product for reviews');
        }

        const review = await this.prismaService.review.findFirst({
            where: {
                user_id: userId,
                product_option_id,
                parent_id: null,
            },
            select: {
                id: true,
                video_url: true,
                review_images: true,
            },
        });

        if (review) {
            const isUpdated = await this.prismaService.review.update({
                where: { id: review.id },
                data: {
                    star,
                    comment,
                },
                select: REVIEW_UPDATE_SELECT,
            });

            if (createReviewDto?.video_url) {
                let deleteCloudinaryVideoPromise: Promise<any>;
                if (review.video_url) {
                    deleteCloudinaryVideoPromise = this.mediaService.deleteV2(
                        review.video_url,
                        'video',
                    );
                }

                const updateNewVideoPromise = this.prismaService.review.update({
                    where: { id: review.id },
                    data: { video_url: createReviewDto.video_url },
                });

                await Promise.all([deleteCloudinaryVideoPromise, updateNewVideoPromise]);
            }

            if (createReviewDto?.images && createReviewDto.images?.length > 0) {
                const deleteCloudImagePromises = review.review_images.map(item => {
                    return this.mediaService.deleteV2(item.image_url);
                });
                const deleteReviewImagePromises = this.prismaService.reviewImage.deleteMany({
                    where: { review_id: review.id },
                });

                const updateNewImagePromises = createReviewDto.images.map(imageUrl => {
                    return this.prismaService.reviewImage.create({
                        data: { review_id: review.id, image_url: imageUrl },
                    });
                });
                await Promise.all([
                    deleteCloudImagePromises,
                    deleteReviewImagePromises,
                    ...updateNewImagePromises,
                ]);
            }

            return {
                is_success: isUpdated ? true : false,
                ...isUpdated,
            };
        }

        let newReview = await this.prismaService.review.create({
            data: {
                star,
                comment,
                user_id: userId,
                product_option_id,
            },
            select: REVIEW_UPDATE_SELECT,
        });

        if (createReviewDto?.video_url) {
            const isUpdated = await this.prismaService.review.update({
                where: { id: newReview.id },
                data: { video_url: createReviewDto.video_url },
            });
            newReview = { ...newReview, ...isUpdated };
        }

        if (createReviewDto?.images && createReviewDto.images?.length > 0) {
            const createImagePromises = createReviewDto.images.map(image => {
                return this.prismaService.reviewImage.create({
                    data: { review_id: newReview.id, image_url: image },
                    select: REVIEW_IMAGE_SELECT,
                });
            });

            const images = await Promise.all(createImagePromises);
            newReview = { ...newReview, review_images: images };
        }

        return {
            is_success: newReview ? true : false,
            ...newReview,
        };
    }

    async reply(reviewId: string, userId: string, createReplyReviewDto: CreateReplyReviewDto) {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const review = await this.prismaService.review.findUnique({
            where: { id: reviewId },
            select: REVIEW_PARENT_SELECT,
        });
        if (!review) {
            throw new NotFoundException('Reviews not found');
        }

        const userComment = await this.prismaService.review.findFirst({
            where: { parent_id: reviewId, user_id: userId },
            select: USER_COMMENT_SELECT,
        });

        const { comment } = createReplyReviewDto;

        if (!userComment) {
            const newReply = await this.prismaService.review.create({
                data: {
                    user_id: userId,
                    product_option_id: review.product_option_id,
                    parent_id: reviewId,
                    comment,
                    star: null,
                },
                select: REPLY_REVIEW_SELECT,
            });

            return {
                is_success: newReply ? true : false,
                ...newReply,
            };
        }

        const updateReply = await this.prismaService.review.update({
            where: { id: userComment.id },
            data: {
                comment,
                star: null,
            },
            select: REPLY_REVIEW_SELECT,
        });

        return {
            is_success: updateReply ? true : false,
            ...updateReply,
        };
    }

    async findByProductOptionId(productOptionId: string) {
        const product = await this.prismaService.productOption.findFirst({
            where: { id: productOptionId },
        });
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return await this.prismaService.review.findMany({
            where: {
                product_option_id: productOptionId,
                parent_id: null,
            },
            select: REVIEW_DETAIL_SELECT,
        });
    }

    async findByParentId(parentId: string) {
        const review = await this.prismaService.review.findUnique({
            where: { id: parentId },
        });
        if (!review) {
            throw new NotFoundException('Review not found');
        }

        return await this.prismaService.review.findMany({
            where: { parent_id: parentId },
            select: REVIEW_DETAIL_SELECT,
        });
    }

    async remove(reviewId: string, userId: string) {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const review = await this.prismaService.review.findUnique({
            where: { id: reviewId, user_id: userId },
            select: REVIEW_DELETE_SELECT,
        });

        if (!review) {
            throw new NotFoundException('Reviews not found');
        }

        let deleteVideoPromise: Promise<any>,
            deleteImagePromises: Promise<any>[] = [];

        if (review?.video_url) {
            deleteVideoPromise = this.mediaService.deleteV2(review.video_url, 'video');
        }

        if (review?.review_images?.length > 0) {
            deleteImagePromises = review.review_images.map(item => {
                return this.mediaService.deleteV2(item.image_url);
            });
        }

        const deleteReviewPromise = this.prismaService.review.delete({
            where: {
                id: review.id,
            },
            select: REVIEW_UPDATE_SELECT,
        });

        await Promise.all([deleteVideoPromise, ...deleteImagePromises, deleteReviewPromise]);

        return {
            is_success: true,
        };
    }
}
