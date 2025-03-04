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
    UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';

import { AtJwtGuard } from 'src/auth/guards';
import { Permission, ResponseMessage } from 'src/common/decorators';
import { RoleGuard } from 'src/common/guards';

import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    @ResponseMessage('Create category success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        return await this.categoryService.create(createCategoryDto);
    }

    @Get()
    @ResponseMessage('Get all categories success')
    @HttpCode(HttpStatus.OK)
    async findAll() {
        return await this.categoryService.findAll();
    }

    @Get('admin')
    @ResponseMessage('Get all categories success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async adminFindAll() {
        return await this.categoryService.adminFindAll();
    }

    @Get(':id')
    @ResponseMessage('Get category success')
    @HttpCode(HttpStatus.OK)
    async findById(@Param('id') id: string) {
        return await this.categoryService.findById(id);
    }

    @Patch(':id')
    @ResponseMessage('Update success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return await this.categoryService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    @ResponseMessage('Remove success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string) {
        return await this.categoryService.remove(id);
    }

    @Post('restore/:id')
    @ResponseMessage('Restore success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async restore(@Param('id') id: string) {
        return await this.categoryService.restore(id);
    }
}
