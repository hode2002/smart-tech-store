import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';

import { GetUserId, Permission, ResponseMessage } from '@/common/decorators';
import { RoleGuard } from '@/common/guards';
import { AtJwtGuard } from '@v1/modules/auth/guards';

import { CreateReplyReviewDto, CreateReviewDto } from './dto';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Get()
    @ResponseMessage('Get all reviews success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async getAllReviews() {
        return await this.reviewService.getAllReviews();
    }

    @Post()
    @ResponseMessage('Create new review success')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.CREATED)
    async upsertReview(@GetUserId() userId: string, @Body() createReviewDto: CreateReviewDto) {
        return await this.reviewService.upsertReview(userId, createReviewDto);
    }

    @Post(':id/reply')
    @ResponseMessage('Reply success')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.CREATED)
    async createReply(
        @GetUserId() userId: string,
        @Param('id') reviewId: string,
        @Body() createReplyReviewDto: CreateReplyReviewDto,
    ) {
        return await this.reviewService.reply(reviewId, userId, createReplyReviewDto);
    }

    @Get('product/:id')
    @ResponseMessage('Get reviews by product option success')
    @HttpCode(HttpStatus.OK)
    async findByProductOptionId(@Param('id') id: string) {
        return await this.reviewService.findByProductOptionId(id);
    }

    @Get('parents/:id')
    @ResponseMessage('Get reviews success')
    @HttpCode(HttpStatus.OK)
    async findByParentId(@Param('id') parentId: string) {
        return await this.reviewService.findByParentId(parentId);
    }

    @Delete(':id')
    @ResponseMessage('Remove review success')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@GetUserId() userId: string, @Param('id') reviewId: string) {
        return await this.reviewService.remove(reviewId, userId);
    }
}
