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

        const review = await this.prismaService.review.upsert({
            where: {
                user_id: userId,
                product_option_id,
            },
            create: {
                comment,
                star,
                user_id: userId,
                product_option_id,
            },
            update: {
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
            is_success: review ? true : false,
            ...review,
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
                product_option_id: true,
            },
        });
        if (!review) {
            throw new NotFoundException('Review not found');
        }

        const { comment } = createReplyReviewDto;

        const isUpdated = await this.prismaService.review.upsert({
            where: {
                user_id: userId,
                product_option_id: review.product_option_id,
            },
            update: {
                comment,
            },
            create: {
                parent_id: reviewId,
                user_id: userId,
                product_option_id: review.product_option_id,
                comment,
            },
            select: {
                id: true,
                parent: {
                    select: {
                        id: true,
                        star: true,
                        comment: true,
                    },
                },
                comment: true,
            },
        });

        return {
            is_success: isUpdated ? true : false,
            ...isUpdated,
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
                child: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true,
                            },
                        },
                        comment: true,
                        created_at: true,
                    },
                },
                created_at: true,
            },
        });
    }
}
