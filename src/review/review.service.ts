import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateReplyReviewDto, CreateReviewDto } from './dto';
import { OrderStatus } from 'src/order/types';

@Injectable()
export class ReviewService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly userService: UserService,
    ) {}

    async getAllReviews() {
        return await this.prismaService.review.findMany({
            where: {
                parent_id: null,
            },
            select: {
                id: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
                product_option: {
                    select: {
                        id: true,
                        sku: true,
                        thumbnail: true,
                        product: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                star: true,
                comment: true,
                _count: true,
                children: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true,
                                role: true,
                            },
                        },
                        comment: true,
                        _count: true,
                    },
                },
                created_at: true,
            },
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
            throw new NotFoundException(
                'Forbidden: Please purchase this product for reviews',
            );
        }

        const review = await this.prismaService.review.findFirst({
            where: {
                user_id: userId,
                product_option_id,
                parent_id: null,
            },
            select: {
                id: true,
            },
        });

        if (review) {
            const isUpdated = await this.prismaService.review.update({
                where: { id: review.id },
                data: {
                    comment,
                    star,
                },
                select: {
                    id: true,
                    star: true,
                    comment: true,
                },
            });

            return {
                is_success: isUpdated ? true : false,
                ...isUpdated,
            };
        }

        const newReview = await this.prismaService.review.create({
            data: {
                comment,
                star,
                user_id: userId,
                product_option_id,
            },
            select: {
                id: true,
                star: true,
                comment: true,
            },
        });

        return {
            is_success: newReview ? true : false,
            ...newReview,
        };
    }

    async reply(
        reviewId: string,
        userId: string,
        createReplyReviewDto: CreateReplyReviewDto,
    ) {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const review = await this.prismaService.review.findUnique({
            where: { id: reviewId },
            select: {
                user: {
                    select: { id: true },
                },
                product_option_id: true,
            },
        });
        if (!review) {
            throw new NotFoundException('Reviews not found');
        }

        const userComment = await this.prismaService.review.findFirst({
            where: { parent_id: reviewId, user_id: userId },
            select: {
                id: true,
                user: {
                    select: { id: true },
                },
                product_option_id: true,
            },
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
                select: {
                    id: true,
                    comment: true,
                },
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
            select: {
                id: true,
                comment: true,
            },
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
            select: {
                id: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
                star: true,
                comment: true,
                _count: true,
                children: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true,
                            },
                        },
                        comment: true,
                        _count: true,
                    },
                },
                created_at: true,
            },
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
            select: {
                id: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
                comment: true,
                _count: true,
                children: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true,
                            },
                        },
                        comment: true,
                        _count: true,
                    },
                },
                created_at: true,
            },
        });
    }

    async remove(reviewId: string, userId: string) {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const review = await this.prismaService.review.findUnique({
            where: { id: reviewId, user_id: userId },
            select: {
                id: true,
                user: {
                    select: { id: true },
                },
                star: true,
                parent_id: true,
                product_option_id: true,
            },
        });

        if (!review) {
            throw new NotFoundException('Reviews not found');
        }

        const isDeleted = await this.prismaService.review.delete({
            where: {
                id: review.id,
            },
            select: {
                id: true,
                star: true,
                comment: true,
            },
        });

        return {
            is_success: isDeleted ? true : false,
            ...isDeleted,
        };
    }
}
