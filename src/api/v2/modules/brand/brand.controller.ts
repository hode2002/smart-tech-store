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
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiConsumes,
    ApiBearerAuth,
    ApiQuery,
    ApiParam,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { Permission, ResponseMessage } from '@/common/decorators';
import { PaginationDto } from '@/common/dtos';
import { RoleGuard } from '@/common/guards';
import { FileUploadInterceptor } from '@/common/interceptors';
import { AtJwtGuard } from '@v2/modules/auth/guards';
import { CreateBrandDto, UpdateBrandDto } from '@v2/modules/brand/dto';
import { BrandService } from '@v2/modules/brand/services';

@ApiTags('Brands')
@Controller('brands')
export class BrandController {
    constructor(private readonly brandService: BrandService) {}

    @ApiOperation({ summary: 'Create a new brand' })
    @ApiResponse({ status: 201, description: 'Brand created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: CreateBrandDto })
    @ApiBearerAuth()
    @Post()
    @ResponseMessage('Create new brand successfully')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @UseInterceptors(FileUploadInterceptor.CustomSingleField('logo'))
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() createBrandDto: CreateBrandDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.brandService.create(createBrandDto, file);
    }

    @ApiOperation({ summary: 'Get all brands' })
    @ApiResponse({ status: 200, description: 'List of brands' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @Get()
    @ResponseMessage('Get all brands successfully')
    @HttpCode(HttpStatus.OK)
    async findAll(@Query() paginationDto: PaginationDto) {
        return this.brandService.findAll(paginationDto.page, paginationDto.limit);
    }

    @ApiOperation({ summary: 'Get all brands (Admin only)' })
    @ApiResponse({ status: 200, description: 'List of brands' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiBearerAuth()
    @Get('admin')
    @ResponseMessage('Get all brands successfully')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async AdminFindAll(@Query() paginationDto: PaginationDto) {
        return this.brandService.adminFindAll(paginationDto.page, paginationDto.limit);
    }

    @ApiOperation({ summary: 'Get brands by category' })
    @ApiResponse({ status: 200, description: 'List of brands in category' })
    @ApiParam({ name: 'slug', description: 'Category slug' })
    @Get('category/:slug')
    @ResponseMessage('Get brand successfully')
    @HttpCode(HttpStatus.OK)
    async findByCategory(@Param('slug') slug: string, @Query() paginationDto: PaginationDto) {
        return this.brandService.findByCategory(slug, paginationDto.page, paginationDto.limit);
    }

    @ApiOperation({ summary: 'Get brand by ID' })
    @ApiResponse({ status: 200, description: 'Brand details' })
    @ApiParam({ name: 'id', description: 'Brand ID' })
    @Get(':id')
    @ResponseMessage('Get brand successfully')
    @HttpCode(HttpStatus.OK)
    async findById(@Param('id') id: string) {
        return this.brandService.findById(id);
    }

    @ApiOperation({ summary: 'Get brand by name' })
    @ApiResponse({ status: 200, description: 'Brand details' })
    @ApiParam({ name: 'id', description: 'Brand ID' })
    @Get('/slug/:slug')
    @ResponseMessage('Get brand successfully')
    @HttpCode(HttpStatus.OK)
    async findBySlug(@Param('slug') slug: string) {
        return this.brandService.findBySlug(slug);
    }

    @ApiOperation({ summary: 'Update brand' })
    @ApiResponse({ status: 200, description: 'Brand updated successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UpdateBrandDto })
    @ApiBearerAuth()
    @Patch(':id')
    @ResponseMessage('Update brand successfully')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @UseInterceptors(FileUploadInterceptor.CustomSingleField('logo'))
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id') id: string,
        @Body() updateBrandDto: UpdateBrandDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.brandService.update(id, updateBrandDto, file);
    }

    @ApiOperation({ summary: 'Restore deleted brand' })
    @ApiResponse({ status: 200, description: 'Brand restored successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiBearerAuth()
    @Patch(':id/restore')
    @ResponseMessage('Restore brand successfully')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async restore(@Param('id') id: string) {
        return this.brandService.restore(id);
    }

    @ApiOperation({ summary: 'Delete brand' })
    @ApiResponse({ status: 200, description: 'Brand deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiBearerAuth()
    @Delete(':id')
    @ResponseMessage('Delete brand successfully')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async softDelete(@Param('id') id: string) {
        return this.brandService.softDelete(id);
    }

    @ApiOperation({ summary: 'Delete brand (permanent)' })
    @ApiResponse({ status: 200, description: 'Brand deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiBearerAuth()
    @Delete('/permanent/:id')
    @ResponseMessage('Delete brand successfully')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async permanentlyDelete(@Param('id') id: string) {
        return this.brandService.permanentlyDelete(id);
    }
}
