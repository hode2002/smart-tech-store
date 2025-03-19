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
    ApiConsumes,
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
import { BannerService } from '@v2/modules/banner/services/banner.service';

import { CreateBannerDto, UpdateBannerDto } from './dto';

@ApiTags('Banner Management')
@Controller('banners')
export class BannerController {
    constructor(private readonly bannerService: BannerService) {}

    @Post()
    @ResponseMessage('Create banner successfully')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @UseInterceptors(FileUploadInterceptor.CustomField('image'))
    @HttpCode(HttpStatus.CREATED)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Create a new banner',
        description: 'Creates a new banner with image upload capability. Admin access required.',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['title', 'type', 'image'],
            properties: {
                title: {
                    type: 'string',
                    example: 'Halloween Sale 2023',
                    description: 'Title of the banner',
                },
                link: {
                    type: 'string',
                    example: 'https://example.com/halloween-sale',
                    description: 'URL link for the banner',
                },
                type: {
                    type: 'string',
                    enum: ['slide', 'big', 'small'],
                    example: 'slide',
                    description: 'Type of banner display',
                },
                image: {
                    type: 'string',
                    format: 'binary',
                    description: 'Banner image file (supported formats: JPG, PNG)',
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Banner created successfully',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
                title: { type: 'string', example: 'Halloween Sale 2023' },
                slug: { type: 'string', example: 'halloween-sale-2023' },
                link: { type: 'string', example: 'https://example.com/halloween-sale' },
                type: { type: 'string', example: 'slide' },
                image: { type: 'string', example: 'https://cloudinary.com/image.jpg' },
                status: { type: 'string', example: 'show' },
                created_at: { type: 'string', format: 'date-time' },
                updated_at: { type: 'string', format: 'date-time' },
            },
        },
    })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    async create(
        @Body() createBannerDto: CreateBannerDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.bannerService.create(createBannerDto, file);
    }

    @Get()
    @ResponseMessage('Get all banners successfully')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get all active banners',
        description: 'Retrieves a paginated list of all active banners',
    })
    @ApiResponse({
        status: 200,
        description: 'List of banners retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            title: { type: 'string' },
                            image: { type: 'string' },
                            type: { type: 'string' },
                            link: { type: 'string' },
                            status: { type: 'string' },
                        },
                    },
                },
                meta: {
                    type: 'object',
                    properties: {
                        total: { type: 'number' },
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        totalPages: { type: 'number' },
                    },
                },
            },
        },
    })
    async findAll(@Query() paginationDto: PaginationDto) {
        return this.bannerService.findAll(paginationDto.page, paginationDto.limit);
    }

    @Get('admin')
    @ResponseMessage('Get all banners successfully')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Get all banners (Admin)',
        description: 'Retrieves all banners including inactive ones. Admin access required.',
    })
    @ApiResponse({ status: 200, description: 'List of all banners retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    async AdminFindAll(@Query() paginationDto: PaginationDto) {
        return this.bannerService.AdminFindAll(paginationDto.page, paginationDto.limit);
    }

    @Patch(':id')
    @ResponseMessage('Update banner successfully')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @UseInterceptors(FileUploadInterceptor.CustomField('image'))
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Update banner',
        description: 'Update an existing banner by ID. Admin access required.',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'Banner unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                    example: 'Updated Halloween Sale',
                },
                link: {
                    type: 'string',
                    example: 'https://example.com/updated-sale',
                },
                type: {
                    type: 'string',
                    enum: ['slide', 'big', 'small'],
                },
                status: {
                    type: 'string',
                    enum: ['show', 'hide'],
                },
                image: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Banner updated successfully' })
    @ApiResponse({ status: 404, description: 'Banner not found' })
    async update(
        @Param('id') id: string,
        @Body() updateBannerDto: UpdateBannerDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.bannerService.update(id, updateBannerDto, file);
    }

    @Delete(':id')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Delete banner',
        description: 'Delete a banner by ID. Admin access required.',
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'Banner unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
        status: 200,
        description: 'Banner deleted successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
            },
        },
    })
    @ApiResponse({ status: 404, description: 'Banner not found' })
    async delete(@Param('id') id: string) {
        return this.bannerService.delete(id);
    }
}
