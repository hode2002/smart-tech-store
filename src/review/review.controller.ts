import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { AtJwtGuard } from 'src/auth/guards';
import { SuccessResponse } from 'src/common/response';
import { GetUserId, Permission } from 'src/common/decorators';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/common/guards';
import { CreateReplyReviewDto, CreateReviewDto } from './dto';

@Controller('api/v1/reviews')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Post()
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.CREATED)
    async upsertReview(
        @GetUserId() userId: string,
        @Body() createReviewDto: CreateReviewDto,
    ): Promise<SuccessResponse> {
        return {
            code: 201,
            status: 'Success',
            message: 'Create new review success',
            data: await this.reviewService.upsertReview(
                userId,
                createReviewDto,
            ),
        };
    }

    @Post(':id/reply')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.CREATED)
    async reply(
        @GetUserId() userId: string,
        @Param('id') reviewId: string,
        @Body() createReplyReviewDto: CreateReplyReviewDto,
    ): Promise<SuccessResponse> {
        return {
            code: 201,
            status: 'Success',
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
            code: 201,
            status: 'Success',
            message: 'Get reviews by product option success',
            data: await this.reviewService.findByProductOptionId(id),
        };
    }
}
