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
    Req,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
    CreateProductDto,
    CreateProductOptionDto,
    UpdateProductDto,
    UpdateProductOptionDto,
} from './dto';
import { Permission } from 'src/common/decorators';
import { Role } from '@prisma/client';
import { AtJwtGuard } from 'src/auth/guards';
import { RoleGuard } from 'src/common/guards';
import { SuccessResponse } from 'src/common/response';
import { Request } from 'express';

@Controller('api/v1/products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(@Req() request: Request): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Get products success',
            data: await this.productService.findAll(request),
        };
    }

    @Get('/management')
    @HttpCode(HttpStatus.OK)
    async findAllManagement(@Req() request: Request): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Get products success',
            data: await this.productService.findAllManagement(request),
        };
    }

    @Get('sale')
    @HttpCode(HttpStatus.OK)
    async getProductSale(): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Get product sale success',
            data: await this.productService.getProductSale(),
        };
    }

    @Get('brand/:slug')
    @HttpCode(HttpStatus.OK)
    async getByBrand(@Param('slug') slug: string): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Get products by brand success',
            data: await this.productService.getByBrand(slug),
        };
    }

    @Get('category/:slug')
    @HttpCode(HttpStatus.OK)
    async getByCategory(@Param('slug') slug: string): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Get products by category success',
            data: await this.productService.getByCategory(slug),
        };
    }

    @Get('parameters')
    @HttpCode(HttpStatus.OK)
    async getByParameters(@Req() request: Request): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Get products success',
            data: await this.productService.getByParameters(request),
        };
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findById(@Param('id') id: string): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Get product detail success',
            data: await this.productService.findById(id),
        };
    }

    @Post()
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() createProductDto: CreateProductDto,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Create new product success',
            data: await this.productService.create(createProductDto),
        };
    }

    @Post('options')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.CREATED)
    async createProductOption(
        @Body() createProductOptionDto: CreateProductOptionDto,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Create new product option success',
            data: await this.productService.createProductOption(
                createProductOptionDto,
            ),
        };
    }

    @Patch(':id')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Update product success',
            data: await this.productService.update(id, updateProductDto),
        };
    }

    @Patch('options/:id')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async updateProductOption(
        @Param('id') id: string,
        @Body() updateProductOptionDto: UpdateProductOptionDto,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Update product option success',
            data: await this.productService.updateProductOption(
                id,
                updateProductOptionDto,
            ),
        };
    }

    @Patch('options/restore/:id')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async restoreProductOption(
        @Param('id') id: string,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Restore product option success',
            data: await this.productService.restoreProductOption(id),
        };
    }

    @Delete('options/:id')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async removeProductOption(
        @Param('id') id: string,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Remove product option success',
            data: await this.productService.removeProductOption(id),
        };
    }
}
