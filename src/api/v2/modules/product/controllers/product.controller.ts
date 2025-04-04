import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Request } from 'express';

import { Permission, ResponseMessage } from '@/common/decorators';
import { RoleGuard } from '@/common/guards';
import { AtJwtGuard } from '@v2/modules/auth/guards';
import { PRODUCT_TOKENS } from '@v2/modules/product/constants';
import { CreateProductDto, UpdateProductDto } from '@v2/modules/product/dtos';
import { IProductCommandService, IProductQueryService } from '@v2/modules/product/interfaces';

@ApiTags('Products')
@Controller('products')
export class ProductController {
    constructor(
        @Inject(PRODUCT_TOKENS.SERVICES.PRODUCT_QUERY)
        private readonly queryService: IProductQueryService,
        @Inject(PRODUCT_TOKENS.SERVICES.PRODUCT_COMMAND)
        private readonly commandService: IProductCommandService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Get all products' })
    @ApiResponse({ status: 200, description: 'Returns a paginated list of products' })
    @ResponseMessage('Get all products success')
    async findAll(@Req() request: Request) {
        return this.queryService.findAll(request);
    }

    @Get('management')
    @ApiOperation({ summary: 'Get product management details' })
    @ApiParam({ name: 'id', description: 'Product ID' })
    @ApiResponse({ status: 200, description: 'Returns product management details' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    @ApiBearerAuth('access-token')
    @ResponseMessage('Get product management detail success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    async findProductManagement(@Req() request: Request) {
        return this.queryService.findAllManagement(request);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get product by ID' })
    @ApiParam({ name: 'id', description: 'Product ID' })
    @ApiResponse({ status: 200, description: 'Returns product details' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    @ResponseMessage('Get product detail success')
    async findById(@Param('id') id: string) {
        return this.queryService.findById(id);
    }

    @Get('slug/:slug')
    @ApiOperation({ summary: 'Get product by slug' })
    @ApiParam({ name: 'slug', description: 'Product slug' })
    @ApiResponse({ status: 200, description: 'Returns product details' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    @ResponseMessage('Get product detail by slug success')
    async findBySlug(@Param('slug') slug: string) {
        return this.queryService.findBySlug(slug);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new product' })
    @ApiResponse({ status: 201, description: 'Product created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 409, description: 'Product with this name already exists' })
    @ApiBearerAuth('access-token')
    @ResponseMessage('Create product success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createProductDto: CreateProductDto) {
        return this.commandService.create(createProductDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a product' })
    @ApiParam({ name: 'id', description: 'Product ID' })
    @ApiResponse({ status: 200, description: 'Product updated successfully' })
    @ApiResponse({ status: 400, description: 'Bad request or product not found' })
    @ApiBearerAuth('access-token')
    @ResponseMessage('Update product success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.commandService.update(id, updateProductDto);
    }

    @Patch(':id/restore')
    @ApiOperation({ summary: 'Restore a product' })
    @ApiParam({ name: 'id', description: 'Product ID' })
    @ApiResponse({ status: 200, description: 'Product restored successfully' })
    @ApiResponse({ status: 400, description: 'Bad request or product not found' })
    @ApiBearerAuth('access-token')
    @ResponseMessage('Restore product success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async restore(@Param('id') id: string) {
        return this.commandService.restore(id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a product' })
    @ApiParam({ name: 'id', description: 'Product ID' })
    @ApiResponse({ status: 200, description: 'Product deleted successfully' })
    @ApiResponse({ status: 400, description: 'Bad request or product not found' })
    @ApiBearerAuth('access-token')
    @ResponseMessage('Delete product success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async delete(@Param('id') id: string) {
        return this.commandService.softDelete(id);
    }
}
