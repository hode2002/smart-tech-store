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
    Req,
    UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Request } from 'express';

import { Permission, ResponseMessage } from '@/common/decorators';
import { RoleGuard } from '@/common/guards';
import { AtJwtGuard } from '@v1/modules/auth/guards';

import {
    CreateComboDto,
    CreateProductComboDto,
    CreateProductDto,
    CreateProductOptionDto,
    UpdateProductComboDto,
    UpdateProductDto,
    UpdateProductOptionDto,
} from './dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get()
    @ResponseMessage('Get products success')
    @HttpCode(HttpStatus.OK)
    async findAll(@Req() request: Request) {
        return await this.productService.findAll(request);
    }

    @Get('images')
    @ResponseMessage('Get product images success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async getProductImages() {
        return await this.productService.getProductImages();
    }

    @Get('combos')
    @ResponseMessage('Get all combo success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async getAllProductCombo() {
        return await this.productService.getAllProductCombo();
    }

    @Post('combos')
    @ResponseMessage('Create combo success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.CREATED)
    async createCombo(@Body() createComboDto: CreateComboDto) {
        return await this.productService.createCombo(createComboDto);
    }

    @Post('product-combos')
    @ResponseMessage('Create product combo success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.CREATED)
    async createProductCombo(@Body() createProductComboDto: CreateProductComboDto) {
        return await this.productService.createProductCombo(createProductComboDto);
    }

    @Post('get-by-array')
    @ResponseMessage('Get products success')
    @HttpCode(HttpStatus.OK)
    async getByArrayIds(@Body('product_option_ids') product_option_ids: string[]) {
        return await this.productService.getByArrayIds(product_option_ids);
    }

    @Get(':id/management')
    @ResponseMessage('Get product success')
    @HttpCode(HttpStatus.OK)
    async findDetailManagement(@Param('id') id: string) {
        return await this.productService.findDetailManagement(id);
    }

    @Get('/management')
    @ResponseMessage('Get products success')
    @HttpCode(HttpStatus.OK)
    async findAllManagement(@Req() request: Request) {
        return await this.productService.findAllManagement(request);
    }

    @Get('sale')
    @ResponseMessage('Get product sale success')
    @HttpCode(HttpStatus.OK)
    async getProductSale() {
        return await this.productService.getProductSale();
    }

    @Get('brand/:slug')
    @ResponseMessage('Get products by brand success')
    @HttpCode(HttpStatus.OK)
    async getByBrand(@Param('slug') slug: string) {
        return await this.productService.getByBrand(slug);
    }

    @Get('category/:slug')
    @ResponseMessage('Get products by category success')
    @HttpCode(HttpStatus.OK)
    async getByCategory(@Param('slug') slug: string) {
        return await this.productService.getByCategory(slug);
    }

    @Get('parameters')
    @ResponseMessage('Get products success')
    @HttpCode(HttpStatus.OK)
    async getByParameters(@Req() request: Request) {
        return await this.productService.getByParameters(request);
    }

    @Get('search')
    @ResponseMessage('Get products success')
    @HttpCode(HttpStatus.OK)
    async getByName(@Req() request: Request) {
        return await this.productService.getByName(request);
    }

    @Get('option-value')
    @ResponseMessage('Get product option value success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async getOptionValue() {
        return await this.productService.getOptionValue();
    }

    @Get('slug/:slug')
    @ResponseMessage('Get product detail success')
    @HttpCode(HttpStatus.OK)
    async findBySlug(@Param('slug') slug: string) {
        return await this.productService.findBySlug(slug);
    }

    @Get(':id')
    @ResponseMessage('Get product detail success')
    @HttpCode(HttpStatus.OK)
    async findById(@Param('id') id: string) {
        return await this.productService.findById(id);
    }

    @Post()
    @ResponseMessage('Create new product success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createProductDto: CreateProductDto) {
        return await this.productService.create(createProductDto);
    }

    @Post('options')
    @ResponseMessage('Create new product option success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.CREATED)
    async createProductOption(@Body() createProductOptionDto: CreateProductOptionDto) {
        return await this.productService.createProductOption(createProductOptionDto);
    }

    @Patch('combos/:id')
    @ResponseMessage('Update combo success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async updateStatusCombo(@Param('id') id: string, @Body('status') status: number) {
        return await this.productService.updateStatusCombo(id, status);
    }

    @Patch('product-combos/:id')
    @ResponseMessage('Update product combo success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async updateProductCombo(
        @Param('id') id: string,
        @Body() updateProductComboDto: UpdateProductComboDto,
    ) {
        return await this.productService.updateProductCombo(id, updateProductComboDto);
    }

    @Patch(':id')
    @ResponseMessage('Update product success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return await this.productService.update(id, updateProductDto);
    }

    @Patch('options/:id')
    @ResponseMessage('Update product option success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async updateProductOption(
        @Param('id') id: string,
        @Body() updateProductOptionDto: UpdateProductOptionDto,
    ) {
        return await this.productService.updateProductOption(id, updateProductOptionDto);
    }

    @Patch('options/restore/:id')
    @ResponseMessage('Restore product option success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async restoreProductOption(@Param('id') id: string) {
        return await this.productService.restoreProductOption(id);
    }

    @Delete('options/:id')
    @ResponseMessage('Remove product option success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async removeProductOption(@Param('id') id: string) {
        return await this.productService.removeProductOption(id);
    }
}
