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
import { ProductService } from './product.service';
import {
    CreateProductDto,
    RemoveProductDto,
    RestoreProductDto,
    UpdateProductDto,
} from './dto';
import { Permission } from 'src/common/decorators';
import { Role } from '@prisma/client';
import { AtJwtGuard } from 'src/auth/guards';
import { RoleGuard } from 'src/common/guards';
import { SuccessResponse } from 'src/common/response';

@Controller('api/v1/products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Get products success',
            data: await this.productService.findAll(),
        };
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findById(@Param('id') id: string): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Get product detail success',
            data: await this.productService.findById(+id),
        };
    }

    @Post()
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createProductDto: CreateProductDto) {
        return {
            code: 201,
            status: 'Success',
            message: 'Create new product success',
            data: await this.productService.create(createProductDto),
        };
    }

    @Post('restore')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async restore(@Body() restoreProductDto: RestoreProductDto) {
        return {
            code: 200,
            status: 'Success',
            message: 'Restore product success',
            data: await this.productService.restore(restoreProductDto),
        };
    }

    @Patch(':id')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
    ) {
        return {
            code: 200,
            status: 'Success',
            message: 'Update product success',
            data: await this.productService.update(+id, updateProductDto),
        };
    }

    @Delete()
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Body() removeProductDto: RemoveProductDto) {
        return {
            code: 200,
            status: 'Success',
            message: 'Remove product success',
            data: await this.productService.remove(removeProductDto),
        };
    }
}
