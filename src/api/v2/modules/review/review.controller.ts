import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { GetUserId, Permission, ResponseMessage } from '@/common/decorators';
import { PaginationDto } from '@/common/dtos';
import { AtJwtGuard } from '@v2/modules/auth/guards';
import { REVIEW_TOKENS } from '@v2/modules/review/constants';
import { CreateReplyReviewDto, CreateReviewDto } from '@v2/modules/review/dto';
import { IReviewCommandService, IReviewQueryService } from '@v2/modules/review/interfaces';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
    constructor(
        @Inject(REVIEW_TOKENS.SERVICES.COMMAND)
        private readonly reviewCommandService: IReviewCommandService,
        @Inject(REVIEW_TOKENS.SERVICES.QUERY)
        private readonly reviewQueryService: IReviewQueryService,
    ) {}

    @Get()
    @ApiBearerAuth('access-token')
    @ResponseMessage('Get all reviews successfully')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get all reviews' })
    @ApiResponse({ status: 200, description: 'Successfully retrieved all reviews.' })
    async findAll(@Query() paginationDto: PaginationDto) {
        return this.reviewQueryService.findAll(paginationDto.page, paginationDto.limit);
    }

    @Post()
    @ApiBearerAuth('access-token')
    @ResponseMessage('Create new review successfully')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new review' })
    @ApiBody({ type: CreateReviewDto })
    @ApiResponse({ status: 201, description: 'Successfully created a new review.' })
    async upsertReview(@GetUserId() userId: string, @Body() createReviewDto: CreateReviewDto) {
        return this.reviewCommandService.upsertReview(userId, createReviewDto);
    }

    @Post(':id/reply')
    @ApiBearerAuth('access-token')
    @ResponseMessage('Reply successfully')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Reply to a review' })
    @ApiBody({ type: CreateReplyReviewDto })
    @ApiResponse({ status: 201, description: 'Successfully replied to the review.' })
    async createReply(
        @GetUserId() userId: string,
        @Param('id') reviewId: string,
        @Body() createReplyReviewDto: CreateReplyReviewDto,
    ) {
        return this.reviewCommandService.createReply(reviewId, userId, createReplyReviewDto);
    }

    @Get('product/:id')
    @ResponseMessage('Get reviews by product option successfully')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get reviews by product option ID' })
    @ApiResponse({
        status: 200,
        description: 'Successfully retrieved reviews for the product option.',
    })
    async findByVariantId(@Param('id') id: string, @Query() paginationDto: PaginationDto) {
        return this.reviewQueryService.findByVariantId(id, paginationDto.page, paginationDto.limit);
    }

    @Get('parents/:id')
    @ResponseMessage('Get reviews successfully')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get reviews by parent ID' })
    @ApiResponse({ status: 200, description: 'Successfully retrieved reviews by parent ID.' })
    async findByParentId(@Param('id') parentId: string, @Query() paginationDto: PaginationDto) {
        return this.reviewQueryService.findByParentId(
            parentId,
            paginationDto.page,
            paginationDto.limit,
        );
    }

    @Patch(':id/reply')
    @ApiBearerAuth('access-token')
    @ResponseMessage('Update reply successfully')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Update reply to a review' })
    @ApiBody({ type: CreateReplyReviewDto })
    @ApiResponse({ status: 201, description: 'Successfully update reply to the review.' })
    async updateReply(
        @GetUserId() userId: string,
        @Param('id') reviewId: string,
        @Body() createReplyReviewDto: CreateReplyReviewDto,
    ) {
        return this.reviewCommandService.updateReply(reviewId, userId, createReplyReviewDto);
    }

    @Delete(':id')
    @ApiBearerAuth('access-token')
    @ResponseMessage('Remove review successfully')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete a review' })
    @ApiResponse({ status: 200, description: 'Successfully deleted the review.' })
    async delete(@Param('id') reviewId: string) {
        return this.reviewCommandService.delete(reviewId);
    }
}
