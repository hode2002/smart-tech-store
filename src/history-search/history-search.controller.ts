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
import { CreateHistorySearchDto, CreateHistorySearchListDto } from './dto';

@Controller('/api/v1/history-search')
export class HistorySearchController {
    constructor(private readonly historySearchService: HistorySearchService) {}

    @Get()
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async getHistorySearch(
        @GetUserId() userId: string,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Get history search success',
            data: await this.historySearchService.getHistorySearch(userId),
        };
    }

    @Post()
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.CREATED)
    async createHistorySearch(
        @GetUserId() userId: string,
        @Body() createHistorySearchDto: CreateHistorySearchDto,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Create history search success',
            data: await this.historySearchService.createHistorySearch(
                userId,
                createHistorySearchDto,
            ),
        };
    }

    @Post('/list')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.CREATED)
    async createFormLocalStorage(
        @GetUserId() userId: string,
        @Body() historySearchList: CreateHistorySearchListDto[],
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Create history search list success',
            data: await this.historySearchService.createHistorySearchList(
                userId,
                historySearchList,
            ),
        };
    }

    @Delete(':id')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async deleteHistorySearch(
        @GetUserId() userId: string,
        @Param('id') searchId: string,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Delete history search success',
            data: await this.historySearchService.deleteHistorySearch(
                searchId,
                userId,
            ),
        };
    }
}
