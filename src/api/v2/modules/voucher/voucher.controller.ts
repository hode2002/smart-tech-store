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
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiParam,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { GetUserId, Permission, ResponseMessage } from '@/common/decorators';
import { PaginationDto } from '@/common/dtos';
import { RoleGuard } from '@/common/guards';
import { AtJwtGuard } from '@v2/modules/auth/guards';
import { VOUCHER_TOKENS } from '@v2/modules/voucher/constants';
import {
    ApplyVoucherDto,
    CheckValidVoucherDto,
    CreateVoucherDto,
    UpdateVoucherDto,
} from '@v2/modules/voucher/dtos';
import { VoucherCommandService } from '@v2/modules/voucher/services/voucher-command.service';
import { VoucherQueryService } from '@v2/modules/voucher/services/voucher-query.service';

@ApiTags('Vouchers')
@Controller('vouchers')
export class VoucherController {
    constructor(
        @Inject(VOUCHER_TOKENS.SERVICES.VOUCHER_QUERY_SERVICE)
        private readonly voucherQueryService: VoucherQueryService,
        @Inject(VOUCHER_TOKENS.SERVICES.VOUCHER_COMMAND_SERVICE)
        private readonly voucherCommandService: VoucherCommandService,
    ) {}

    @Post()
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Create a new voucher' })
    @ApiResponse({ status: 201, description: 'Voucher created successfully.' })
    @ApiBody({ type: CreateVoucherDto })
    @ResponseMessage('Voucher created successfully')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createVoucherDto: CreateVoucherDto) {
        return this.voucherCommandService.create(createVoucherDto);
    }

    @Post('check')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Check if a voucher is valid' })
    @ApiResponse({ status: 200, description: 'Voucher validity checked successfully.' })
    @ApiBody({ type: CheckValidVoucherDto })
    @ResponseMessage('Voucher validity checked successfully')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async checkValidVoucher(
        @GetUserId() userId: string,
        @Body() checkValidVoucherDto: CheckValidVoucherDto,
    ) {
        return this.voucherQueryService.checkValidVoucher(userId, checkValidVoucherDto);
    }

    @Post('apply')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Apply a voucher to an order' })
    @ApiResponse({ status: 200, description: 'Voucher applied to order successfully.' })
    @ApiBody({ type: ApplyVoucherDto })
    @ResponseMessage('Voucher applied to order successfully')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async applyVoucherToOrder(@Body() applyVoucherDto: ApplyVoucherDto) {
        return this.voucherCommandService.applyVoucherToOrder(
            applyVoucherDto.orderId,
            applyVoucherDto.voucherCode,
        );
    }

    @Get()
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Retrieve all vouchers' })
    @ApiResponse({ status: 200, description: 'Get vouchers successfully.' })
    @ResponseMessage('Get vouchers successfully')
    @HttpCode(HttpStatus.OK)
    async findAll(@Query() paginationDto: PaginationDto) {
        return this.voucherQueryService.findAll(paginationDto.page, paginationDto.limit);
    }

    @Get(':id')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Retrieve a voucher by ID' })
    @ApiParam({ name: 'id', required: true, description: 'ID of the voucher' })
    @ApiResponse({ status: 200, description: 'Get voucher successfully.' })
    @ResponseMessage('Get voucher successfully')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async findById(@Param('id') id: string) {
        return this.voucherQueryService.findById(id);
    }

    @Patch(':id')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Update a voucher by ID' })
    @ApiParam({ name: 'id', required: true, description: 'ID of the voucher' })
    @ApiBody({ type: UpdateVoucherDto })
    @ApiResponse({ status: 200, description: 'Voucher updated successfully.' })
    @ResponseMessage('Voucher updated successfully')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async update(@Param('id') id: string, @Body() updateVoucherDto: UpdateVoucherDto) {
        return this.voucherCommandService.update(id, updateVoucherDto);
    }

    @Delete(':id')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Delete a voucher by ID' })
    @ApiParam({ name: 'id', required: true, description: 'ID of the voucher' })
    @ApiResponse({ status: 200, description: 'Voucher deleted successfully.' })
    @ResponseMessage('Voucher deleted successfully')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async delete(@Param('id') id: string) {
        return this.voucherCommandService.delete(id);
    }

    @Patch('restore/:id')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Restore a deleted voucher by ID' })
    @ApiParam({ name: 'id', required: true, description: 'ID of the voucher' })
    @ApiResponse({ status: 200, description: 'Voucher restored successfully.' })
    @ResponseMessage('Voucher restored successfully')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async restore(@Param('id') id: string) {
        return this.voucherCommandService.restore(id);
    }
}
