import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    HttpCode,
    HttpStatus,
    Delete,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { AtJwtGuard } from 'src/auth/guards';
import { SuccessResponse } from 'src/common/response';
import { GetUserId, Permission } from 'src/common/decorators';
import { CreateReplyReviewDto, CreateReviewDto } from './dto';
import { RoleGuard } from 'src/common/guards';
import { Role } from '@prisma/client';

@Controller('api/v1/reviews')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Get()
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async getAllReviews(): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Get all reviews success',
            data: await this.reviewService.getAllReviews(),
        };
    }

    @Post()
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.CREATED)
    async upsertReview(
        @GetUserId() userId: string,
        @Body() createReviewDto: CreateReviewDto,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Create new review success',
            data: await this.reviewService.upsertReview(
                userId,
                createReviewDto,
            ),
        };
    }

    @Post(':id/reply')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.CREATED)
    async createReply(
        @GetUserId() userId: string,
        @Param('id') reviewId: string,
        @Body() createReplyReviewDto: CreateReplyReviewDto,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Reply success',
            data: await this.reviewService.reply(
                reviewId,
                userId,
                createReplyReviewDto,
            ),
        };
    }

    @Get('product/:id')
    @HttpCode(HttpStatus.OK)
    async findByProductOptionId(
        @Param('id') id: string,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Get reviews by product option success',
            data: await this.reviewService.findByProductOptionId(id),
        };
    }

    @Get('parents/:id')
    @HttpCode(HttpStatus.OK)
    async findByParentId(
        @Param('id') parentId: string,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Get reviews success',
            data: await this.reviewService.findByParentId(parentId),
        };
    }

    @Delete(':id')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async remove(
        @GetUserId() userId: string,
        @Param('id') reviewId: string,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Remove review success',
            data: await this.reviewService.remove(reviewId, userId),
        };
    }
}
