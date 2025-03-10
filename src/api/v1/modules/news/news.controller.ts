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
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';

import { Permission, ResponseMessage } from '@/common/decorators';
import { RoleGuard } from '@/common/guards';
import { AtJwtGuard } from '@v1/modules/auth/guards';

import { CreateNewsDto, UpdateNewsDto } from './dto';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
    constructor(private readonly newsService: NewsService) {}

    @Post()
    @ResponseMessage('Create success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @UseInterceptors(FileInterceptor('image'))
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createNewsDto: CreateNewsDto, @UploadedFile() file: Express.Multer.File) {
        return await this.newsService.create(createNewsDto, file);
    }

    @Get()
    @ResponseMessage('Get all news success')
    @HttpCode(HttpStatus.OK)
    async findAll() {
        return await this.newsService.findAll();
    }

    @Get('slug/:slug')
    @ResponseMessage('Get news success')
    @HttpCode(HttpStatus.OK)
    async findBySlug(@Param('slug') slug: string) {
        return await this.newsService.findBySlug(slug);
    }

    @Get(':id')
    @ResponseMessage('Get news success')
    @HttpCode(HttpStatus.OK)
    async findById(@Param('id') id: string) {
        return await this.newsService.findById(id);
    }

    @Patch(':id')
    @ResponseMessage('Update success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @UseInterceptors(FileInterceptor('image'))
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id') id: string,
        @Body() updateNewsDto: UpdateNewsDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return await this.newsService.update(id, updateNewsDto, file);
    }

    @Delete(':id')
    @ResponseMessage('Delete success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string) {
        return await this.newsService.remove(id);
    }
}
