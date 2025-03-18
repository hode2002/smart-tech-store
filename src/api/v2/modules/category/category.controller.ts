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
    UseGuards,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
    ApiBody,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { Permission, ResponseMessage } from '@/common/decorators';
import { PaginationDto } from '@/common/dtos';
import { RoleGuard } from '@/common/guards';
import { AtJwtGuard } from '@v2/modules/auth/guards';

import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { CategoryService } from './services';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new category' })
    @ApiBearerAuth()
    @ApiBody({ type: CreateCategoryDto })
    @ApiResponse({
        status: 201,
        description: 'The category has been successfully created.',
    })
    @ResponseMessage('Create category successfully')
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all categories' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({
        status: 200,
        description: 'Return all categories.',
    })
    @ResponseMessage('Get all categories successfully')
    @HttpCode(HttpStatus.OK)
    async findAll(@Query() paginationDto: PaginationDto) {
        return this.categoryService.findAll(paginationDto.page, paginationDto.limit);
    }

    @Get('admin')
    @ResponseMessage('Get all categories successfully')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async adminFindAll(@Query() paginationDto: PaginationDto) {
        return this.categoryService.adminFindAll(paginationDto.page, paginationDto.limit);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a category by id' })
    @ApiParam({ name: 'id', type: 'string' })
    @ApiResponse({
        status: 200,
        description: 'Return the category.',
    })
    @ApiResponse({ status: 404, description: 'Category not found.' })
    @ResponseMessage('Get category successfully')
    @HttpCode(HttpStatus.OK)
    async findById(@Param('id') id: string) {
        return this.categoryService.findById(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a category' })
    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: 'string' })
    @ApiBody({ type: UpdateCategoryDto })
    @ApiResponse({
        status: 200,
        description: 'The category has been successfully updated.',
    })
    @ApiResponse({ status: 404, description: 'Category not found.' })
    @ResponseMessage('Update category successfully')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoryService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a category' })
    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: 'string' })
    @ApiResponse({ status: 200, description: 'The category has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Category not found.' })
    @ResponseMessage('Delete category successfully')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async softDelete(@Param('id') id: string) {
        return this.categoryService.softDelete(id);
    }

    @Delete('permanent/:id')
    @ApiOperation({ summary: 'Delete a category permanently' })
    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: 'string' })
    @ApiResponse({ status: 200, description: 'The category has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Category not found.' })
    @ResponseMessage('Delete category successfully')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async permanentlyDelete(@Param('id') id: string) {
        return this.categoryService.permanentlyDelete(id);
    }

    @Patch(':id/restore')
    @ApiOperation({ summary: 'Restore a category' })
    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: 'string' })
    @ApiResponse({ status: 200, description: 'The category has been successfully restored.' })
    @ApiResponse({ status: 404, description: 'Category not found.' })
    @ResponseMessage('Restore category successfully')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async restore(@Param('id') id: string) {
        return this.categoryService.restore(id);
    }
}
