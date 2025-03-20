import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { Permission, ResponseMessage } from '@/common/decorators';
import { PaginationDto } from '@/common/dtos';
import { RoleGuard } from '@/common/guards';
import { FileUploadInterceptor } from '@/common/interceptors';
import { AtJwtGuard } from '@v2/modules/auth/guards';
import { CreateNewsDto, UpdateNewsDto } from '@v2/modules/news/dto';
import { NewsCommandService, NewsQueryService } from '@v2/modules/news/services';

@ApiTags('News')
@Controller('news')
export class NewsController {
    constructor(
        private readonly newsCommandService: NewsCommandService,
        private readonly newsQueryService: NewsQueryService,
    ) {}

    @Post()
    @ResponseMessage('Create success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @UseInterceptors(FileUploadInterceptor.CustomSingleField('image'))
    @HttpCode(HttpStatus.CREATED)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Create a news article',
        description: 'Create a new news article with an image.',
    })
    @ApiBody({ type: CreateNewsDto })
    @ApiResponse({ status: 201, description: 'News article created successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async create(@Body() createNewsDto: CreateNewsDto, @UploadedFile() file: Express.Multer.File) {
        return this.newsCommandService.create(createNewsDto, file);
    }

    @Get()
    @ResponseMessage('Get all news successfully')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get all news articles',
        description: 'Retrieve all news articles with pagination.',
    })
    @ApiResponse({ status: 200, description: 'News articles retrieved successfully.' })
    async findAll(@Query() paginationDto: PaginationDto) {
        return this.newsQueryService.findAll(paginationDto.page, paginationDto.limit);
    }

    @Get('slug/:slug')
    @ResponseMessage('Get news successfully')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get news by slug',
        description: 'Retrieve a news article by its slug.',
    })
    @ApiParam({ name: 'slug', type: 'string', description: 'The slug of the news article' })
    @ApiResponse({ status: 200, description: 'News article retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'News article not found' })
    async findBySlug(@Param('slug') slug: string) {
        return this.newsQueryService.findBySlug(slug);
    }

    @Get(':id')
    @ResponseMessage('Get news successfully')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get news by ID', description: 'Retrieve a news article by its ID.' })
    @ApiParam({ name: 'id', type: 'string', description: 'The ID of the news article' })
    @ApiResponse({ status: 200, description: 'News article retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'News article not found' })
    async findById(@Param('id') id: string) {
        return this.newsQueryService.findById(id);
    }

    @Patch(':id')
    @ResponseMessage('Update successfully')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @UseInterceptors(FileUploadInterceptor.CustomSingleField('image'))
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Update a news article',
        description: 'Update an existing news article by ID.',
    })
    @ApiParam({ name: 'id', type: 'string', description: 'The ID of the news article to update' })
    @ApiBody({ type: UpdateNewsDto })
    @ApiResponse({ status: 200, description: 'News article updated successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'News article not found' })
    async update(
        @Param('id') id: string,
        @Body() updateNewsDto: UpdateNewsDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.newsCommandService.update(id, updateNewsDto, file);
    }

    @Delete(':id')
    @ResponseMessage('Delete successfully')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Delete a news article',
        description: 'Delete a news article by its ID.',
    })
    @ApiParam({ name: 'id', type: 'string', description: 'The ID of the news article to delete' })
    @ApiResponse({ status: 200, description: 'News article deleted successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'News article not found' })
    async delete(@Param('id') id: string) {
        return this.newsCommandService.delete(id);
    }
}
