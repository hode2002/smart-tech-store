import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

import { GetUserId, ResponseMessage } from '@/common/decorators';
import { PaginationDto } from '@/common/dtos';
import { AtJwtGuard } from '@v2/modules/auth/guards';
import { CreateHistorySearchDto } from '@v2/modules/history-search/dto';
import {
    HistorySearchCommandService,
    HistorySearchQueryService,
} from '@v2/modules/history-search/services';

@ApiTags('History Search')
@Controller('history-search')
export class HistorySearchController {
    constructor(
        private readonly historySearchCommandService: HistorySearchCommandService,
        private readonly historySearchQueryService: HistorySearchQueryService,
    ) {}

    @Get()
    @ResponseMessage('Get history search successfully')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Get user history searches',
        description: 'Retrieve history searches for the authenticated user.',
    })
    @ApiResponse({ status: 200, description: 'History searches retrieved successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getHistorySearch(@GetUserId() userId: string, @Query() paginationDto: PaginationDto) {
        return this.historySearchQueryService.findByUserId(
            userId,
            paginationDto.page,
            paginationDto.limit,
        );
    }

    @Post()
    @ResponseMessage('Create history search success')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.CREATED)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Create a history search',
        description: 'Create a new history search for the authenticated user.',
    })
    @ApiBody({ type: CreateHistorySearchDto })
    @ApiResponse({ status: 201, description: 'History search created successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async createHistorySearch(
        @GetUserId() userId: string,
        @Body() createHistorySearchDto: CreateHistorySearchDto,
    ) {
        return this.historySearchCommandService.create(userId, createHistorySearchDto);
    }

    @Delete(':id')
    @ResponseMessage('Delete history search success')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Delete a history search',
        description: 'Delete a specific history search by ID for the authenticated user.',
    })
    @ApiParam({ name: 'id', type: 'string', description: 'History search unique identifier' })
    @ApiResponse({ status: 200, description: 'History search deleted successfully.' })
    @ApiResponse({ status: 404, description: 'History search not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async deleteHistorySearch(@GetUserId() userId: string, @Param('id') searchId: string) {
        return this.historySearchCommandService.delete(userId, searchId);
    }
}
