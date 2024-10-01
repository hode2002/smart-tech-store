import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
    UseGuards,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { SuccessResponse } from 'src/common/response';
import { Permission } from 'src/common/decorators';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/common/guards';
import { AtJwtGuard } from 'src/auth/guards';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/api/v1/news')
export class NewsController {
    constructor(private readonly newsService: NewsService) {}

    @Post()
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @UseInterceptors(FileInterceptor('image'))
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() createNewsDto: CreateNewsDto,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Create success',
            data: await this.newsService.create(createNewsDto, file),
        };
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Get all news success',
            data: await this.newsService.findAll(),
        };
    }

    @Get('slug/:slug')
    @HttpCode(HttpStatus.OK)
    async findBySlug(@Param('slug') slug: string): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Get news success',
            data: await this.newsService.findBySlug(slug),
        };
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findById(@Param('id') id: string): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Get news success',
            data: await this.newsService.findById(id),
        };
    }

    @Patch(':id')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @UseInterceptors(FileInterceptor('image'))
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id') id: string,
        @Body() updateNewsDto: UpdateNewsDto,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Update success',
            data: await this.newsService.update(id, updateNewsDto, file),
        };
    }

    @Delete(':id')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Delete success',
            data: await this.newsService.remove(id),
        };
    }
}
