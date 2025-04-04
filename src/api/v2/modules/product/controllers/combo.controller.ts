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
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { Permission, ResponseMessage } from '@/common/decorators';
import { PaginationDto } from '@/common/dtos';
import { RoleGuard } from '@/common/guards';
import { AtJwtGuard } from '@v2/modules/auth/guards';
import { PRODUCT_TOKENS } from '@v2/modules/product/constants';
import { CreateComboDto, UpdateComboDto } from '@v2/modules/product/dtos';
import { IComboCommandService, IComboQueryService } from '@v2/modules/product/interfaces';

@ApiTags('ProductCombos')
@Controller('products/combos')
export class ProductComboController {
    constructor(
        @Inject(PRODUCT_TOKENS.SERVICES.COMBO_COMMAND)
        private readonly comboService: IComboCommandService,
        @Inject(PRODUCT_TOKENS.SERVICES.COMBO_QUERY)
        private readonly comboQueryService: IComboQueryService,
    ) {}

    @Post()
    @ApiOperation({ summary: 'Create a combo' })
    @ApiResponse({ status: 201, description: 'Combo created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 404, description: 'Product option not found' })
    @ApiBearerAuth('access-token')
    @ResponseMessage('Create combo successfully')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createComboDto: CreateComboDto) {
        return this.comboService.create(createComboDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all product combos' })
    @ApiResponse({ status: 200, description: 'Returns all product combos' })
    @ResponseMessage('Get all combos successfully')
    async findAll(@Query() paginationDto: PaginationDto) {
        return this.comboQueryService.findAll(paginationDto.page, paginationDto.limit);
    }

    @Get('management')
    @ApiOperation({ summary: 'Get all product combos for management' })
    @ApiResponse({ status: 200, description: 'Returns all product combos for management' })
    @ResponseMessage('Get all combos for management successfully')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async findAllManagement(@Query() paginationDto: PaginationDto) {
        return this.comboQueryService.findAllManagement(paginationDto.page, paginationDto.limit);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update product combo' })
    @ApiParam({ name: 'id', description: 'Combo ID' })
    @ApiResponse({ status: 200, description: 'Product combo updated successfully' })
    @ApiResponse({ status: 404, description: 'Combo or product option not found' })
    @ApiBearerAuth('access-token')
    @ResponseMessage('Update product combo successfully')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async update(@Param('id') id: string, @Body() updateComboDto: UpdateComboDto) {
        return this.comboService.update(id, updateComboDto);
    }

    @Patch(':id/restore')
    @ApiOperation({ summary: 'Update combo status' })
    @ApiParam({ name: 'id', description: 'Combo ID' })
    @ApiParam({ name: 'status', description: 'New status (0 or 1)' })
    @ApiResponse({ status: 200, description: 'Combo status updated successfully' })
    @ApiResponse({ status: 404, description: 'Combo not found' })
    @ApiBearerAuth('access-token')
    @ResponseMessage('Restore combo successfully')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async restore(@Param('id') id: string) {
        return this.comboService.restore(id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete combo' })
    @ApiParam({ name: 'id', description: 'Combo ID' })
    @ApiResponse({ status: 200, description: 'Combo deleted successfully' })
    @ApiResponse({ status: 404, description: 'Combo not found' })
    @ApiBearerAuth('access-token')
    @ResponseMessage('Delete combo successfully')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async delete(@Param('id') id: string) {
        return this.comboService.softDelete(id);
    }
}
