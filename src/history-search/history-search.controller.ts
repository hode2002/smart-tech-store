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

import { AtJwtGuard } from 'src/auth/guards';
import { GetUserId, ResponseMessage } from 'src/common/decorators';

import { CreateHistorySearchDto, CreateHistorySearchListDto } from './dto';
import { HistorySearchService } from './history-search.service';

@Controller('/api/v1/history-search')
export class HistorySearchController {
    constructor(private readonly historySearchService: HistorySearchService) {}

    @Get()
    @ResponseMessage('Get history search success')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async getHistorySearch(@GetUserId() userId: string) {
        return await this.historySearchService.getHistorySearch(userId);
    }

    @Post()
    @ResponseMessage('Create history search success')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.CREATED)
    async createHistorySearch(
        @GetUserId() userId: string,
        @Body() createHistorySearchDto: CreateHistorySearchDto,
    ) {
        return await this.historySearchService.createHistorySearch(userId, createHistorySearchDto);
    }

    @Post('/list')
    @ResponseMessage('Create history search list success')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.CREATED)
    async createFormLocalStorage(
        @GetUserId() userId: string,
        @Body() historySearchList: CreateHistorySearchListDto[],
    ) {
        return await this.historySearchService.createHistorySearchList(userId, historySearchList);
    }

    @Delete(':id')
    @ResponseMessage('Delete history search success')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async deleteHistorySearch(@GetUserId() userId: string, @Param('id') searchId: string) {
        return await this.historySearchService.deleteHistorySearch(searchId, userId);
    }
}
