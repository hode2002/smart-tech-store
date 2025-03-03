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

import { BrandService } from './brand.service';
import { CreateBrandDto, UpdateBrandDto } from './dto';

@Controller('api/v1/brands')
export class BrandController {
    constructor(private readonly brandService: BrandService) {}

    @Post()
    @ResponseMessage('Create success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @UseInterceptors(FileInterceptor('logo_url'))
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() createBrandDto: CreateBrandDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return await this.brandService.create(createBrandDto, file);
    }

    @Get()
    @ResponseMessage('Get all brands success')
    @HttpCode(HttpStatus.OK)
    async findAll() {
        return await this.brandService.findAll();
    }

    @Get('admin')
    @ResponseMessage('Get all brands success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async adminFindAll() {
        return await this.brandService.adminFindAll();
    }

    @Get('category/:slug')
    @ResponseMessage('Get brand success')
    @HttpCode(HttpStatus.OK)
    async findByCategory(@Param('slug') slug: string) {
        return await this.brandService.findByCategory(slug);
    }

    @Get(':id')
    @ResponseMessage('Get brand success')
    @HttpCode(HttpStatus.OK)
    async findById(@Param('id') id: string) {
        return await this.brandService.findById(id);
    }

    @Patch(':id')
    @ResponseMessage('Update success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @UseInterceptors(FileInterceptor('logo_url'))
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id') id: string,
        @Body() updateBrandDto: UpdateBrandDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return await this.brandService.update(id, updateBrandDto, file);
    }

    @Delete(':id')
    @ResponseMessage('Delete success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string) {
        return await this.brandService.remove(id);
    }

    @Post('restore/:id')
    @ResponseMessage('Restore success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async restore(@Param('id') id: string) {
        return await this.brandService.restore(id);
    }
}
