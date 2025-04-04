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
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { Permission, ResponseMessage } from '@/common/decorators';
import { RoleGuard } from '@/common/guards';
import { AtJwtGuard } from '@v2/modules/auth/guards';
import { PRODUCT_TOKENS } from '@v2/modules/product/constants';
import { CreateVariantDto, UpdateVariantDto } from '@v2/modules/product/dtos';
import { IVariantCommandService, IVariantQueryService } from '@v2/modules/product/interfaces';

@ApiTags('ProductsVariants')
@Controller('products/variants')
export class ProductVariantController {
    constructor(
        @Inject(PRODUCT_TOKENS.SERVICES.VARIANT_COMMAND)
        private readonly variantCommandService: IVariantCommandService,
        @Inject(PRODUCT_TOKENS.SERVICES.VARIANT_QUERY)
        private readonly variantQueryService: IVariantQueryService,
    ) {}

    @Get(':productId')
    @ApiOperation({ summary: 'Get product variant by product id' })
    @ApiResponse({ status: 200, description: 'Product variants retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Product variants not found' })
    @ApiBearerAuth('access-token')
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async findProductVariants(@Param('productId') productId: string) {
        return this.variantQueryService.findByProductId(productId);
    }

    @Post(':productId')
    @ApiOperation({ summary: 'Create product variants' })
    @ApiResponse({ status: 201, description: 'Product variants created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiBearerAuth('access-token')
    @ResponseMessage('Create product variant success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.CREATED)
    async createProductVariant(
        @Param('productId') productId: string,
        @Body() createVariantDto: CreateVariantDto,
    ) {
        return this.variantCommandService.create(productId, createVariantDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update product variant' })
    @ApiParam({ name: 'id', description: 'Product variant ID' })
    @ApiResponse({ status: 200, description: 'Product variant updated successfully' })
    @ApiResponse({ status: 404, description: 'Product variant not found' })
    @ApiBearerAuth('access-token')
    @ResponseMessage('Update product variant success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async updateProductVariant(
        @Param('id') id: string,
        @Body() updateVariantDto: UpdateVariantDto,
    ) {
        return this.variantCommandService.update(id, updateVariantDto);
    }

    @Patch('restore/:id')
    @ApiOperation({ summary: 'Restore a deleted product variant' })
    @ApiParam({ name: 'id', description: 'Product variant ID' })
    @ApiResponse({ status: 200, description: 'Product variant restored successfully' })
    @ApiResponse({ status: 404, description: 'Product variant not found' })
    @ApiBearerAuth('access-token')
    @ResponseMessage('Restore product variant success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async restore(@Param('id') id: string) {
        return this.variantCommandService.restore(id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete a product variant' })
    @ApiParam({ name: 'id', description: 'Product variant ID' })
    @ApiResponse({ status: 200, description: 'Product variant deleted successfully' })
    @ApiResponse({ status: 404, description: 'Product variant not found' })
    @ApiBearerAuth('access-token')
    @ResponseMessage('Remove product variant success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async softDelete(@Param('id') id: string) {
        return this.variantCommandService.softDelete(id);
    }
}
