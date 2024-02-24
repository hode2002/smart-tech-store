import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    HttpCode,
    HttpStatus,
    Delete,
    Param,
} from '@nestjs/common';
import { HistorySearchService } from './history-search.service';
import { AtJwtGuard } from 'src/auth/guards';
import { GetUserId } from 'src/common/decorators';
import { SuccessResponse } from 'src/common/response';
import { CreateHistorySearchDto } from './dto';

@Controller('/api/v1/history-search')
export class HistorySearchController {
    constructor(private readonly historySearchService: HistorySearchService) {}

    @Get()
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async getHistorySearch(
        @GetUserId() userId: number,
    ): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Get history search success',
            data: await this.historySearchService.getHistorySearch(userId),
        };
    }

    @Post()
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async createHistorySearch(
        @GetUserId() userId: number,
        @Body() createHistorySearchDto: CreateHistorySearchDto,
    ): Promise<SuccessResponse> {
        return {
            code: 201,
            status: 'Success',
            message: 'Create history search success',
            data: await this.historySearchService.createHistorySearch(
                userId,
                createHistorySearchDto,
            ),
        };
    }

    @Delete(':id')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async deleteHistorySearch(
        @GetUserId() userId: number,
        @Param('id') searchId: number,
    ): Promise<SuccessResponse> {
        return {
            code: 2010,
            status: 'Success',
            message: 'Delete history search success',
            data: await this.historySearchService.deleteHistorySearch(
                +searchId,
                userId,
            ),
        };
    }
}
