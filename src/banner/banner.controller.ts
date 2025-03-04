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

import { AtJwtGuard } from 'src/auth/guards';
import { Permission, ResponseMessage } from 'src/common/decorators';
import { RoleGuard } from 'src/common/guards';

import { BannerService } from './banner.service';
import { CreateBannerDto, UpdateBannerDto } from './dto';

@Controller('banners')
export class BannerController {
    constructor(private readonly bannerService: BannerService) {}

    @Post()
    @ResponseMessage('Create success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @UseInterceptors(FileInterceptor('image'))
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() createBannerDto: CreateBannerDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return await this.bannerService.create(createBannerDto, file);
    }

    @Get()
    @ResponseMessage('Get all banners success')
    @HttpCode(HttpStatus.OK)
    async findAll() {
        return await this.bannerService.findAll();
    }

    @Get('admin')
    @ResponseMessage('Get all banners success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async AdminFindAll() {
        return await this.bannerService.AdminFindAll();
    }

    @Get(':id')
    @ResponseMessage('Get banner success')
    @HttpCode(HttpStatus.OK)
    async findById(@Param('id') id: string) {
        return await this.bannerService.findById(id);
    }

    @Patch(':id')
    @ResponseMessage('Update success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @UseInterceptors(FileInterceptor('image'))
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id') id: string,
        @Body() updateBannerDto: UpdateBannerDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return await this.bannerService.update(id, updateBannerDto, file);
    }

    @Delete(':id')
    @ResponseMessage('Remove success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string) {
        return await this.bannerService.remove(id);
    }
}
