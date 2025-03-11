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

import { BannerService } from './banner.service';
import { CreateBannerDto, UpdateBannerDto } from './dto';

@ApiTags('Banners')
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
    @ApiOperation({ summary: 'Create banner' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                    example: 'Halloween Sale',
                    description: 'Banner title for creating banner',
                },
                link: {
                    type: 'string',
                    example: 'https://example.com',
                    description: 'A link to product',
                },
                type: {
                    type: 'string',
                    example: 'slide',
                    description: 'slide, big,...',
                },
                image: {
                    type: 'string',
                    format: 'binary',
                    description: 'Image file',
                },
            },
        },
    })
    @ApiResponse({ status: 201, description: 'Return a new banner' })
    async create(
        @Body() createBannerDto: CreateBannerDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.bannerService.create(createBannerDto, file);
    }

    @Get()
    @ResponseMessage('Get all banners successfully')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get all banners' })
    @ApiResponse({ status: 200, description: 'Return a list of banners' })
    async findAll(@Query() paginationDto: PaginationDto) {
        return this.bannerService.findAll(paginationDto.page, paginationDto.limit);
    }

    @Get('admin')
    @ResponseMessage('Get all banners successfully')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Get all banners (Admin only)' })
    @ApiResponse({ status: 200, description: 'Return a list of banners' })
    async AdminFindAll(@Query() paginationDto: PaginationDto) {
        return this.bannerService.AdminFindAll(paginationDto.page, paginationDto.limit);
    }

    @Patch(':id')
    @ResponseMessage('Update banner successfully')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @UseInterceptors(FileUploadInterceptor.CustomField('image'))
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Update banner by id (Admin only)' })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'Banner id',
    })
    @ApiResponse({ status: 200, description: 'Return a updated banner' })
    @ApiResponse({ status: 403, description: 'Forbidden: Admins only' })
    async update(
        @Param('id') id: string,
        @Body() updateBannerDto: UpdateBannerDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.bannerService.update(id, updateBannerDto, file);
    }

    @Delete(':id')
    @ResponseMessage('Remove banner successfully')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Delete banner by id (Admin only)' })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'Banner id',
    })
    @ApiResponse({ status: 200, description: 'Return a success flag: true | false' })
    @ApiResponse({ status: 403, description: 'Forbidden: Admins only' })
    async remove(@Param('id') id: string) {
        return this.bannerService.remove(id);
    }
}
