import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { SuccessResponse } from 'src/common/response';
import { Permission } from 'src/common/decorators';
import { Role } from '@prisma/client';
import { AtJwtGuard } from 'src/auth/guards';
import { RoleGuard } from 'src/common/guards';

@Controller('api/v1/categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() createCategoryDto: CreateCategoryDto,
    ): Promise<SuccessResponse> {
        return {
            code: 201,
            status: 'Success',
            message: 'Create category success',
            data: await this.categoryService.create(createCategoryDto),
        };
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll() {
        return {
            code: 200,
            status: 'Success',
            message: 'Get all categories success',
            data: await this.categoryService.findAll(),
        };
    }

    @Get('admin')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async adminFindAll() {
        return {
            code: 200,
            status: 'Success',
            message: 'Get all categories success',
            data: await this.categoryService.adminFindAll(),
        };
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findById(@Param('id') id: string): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Get category success',
            data: await this.categoryService.findById(id),
        };
    }

    @Patch(':id')
    @Permission(Role.ADMIN)
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto,
    ): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Update success',
            data: await this.categoryService.update(id, updateCategoryDto),
        };
    }

    @Delete(':id')
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Remove success',
            data: await this.categoryService.remove(id),
        };
    }
}
