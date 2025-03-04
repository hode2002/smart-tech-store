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
    UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';

import { AtJwtGuard } from 'src/auth/guards';
import { GetUserId, Permission, ResponseMessage } from 'src/common/decorators';
import { RoleGuard } from 'src/common/guards';
import { CheckValidVoucherDto } from 'src/voucher/dto/check-valid-voucher.dto';

import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { VoucherService } from './voucher.service';

@Controller('vouchers')
export class VoucherController {
    constructor(private readonly voucherService: VoucherService) {}

    @Post()
    @ResponseMessage('Create success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createVoucherDto: CreateVoucherDto) {
        return await this.voucherService.create(createVoucherDto);
    }

    @Post('check')
    @ResponseMessage('Success')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async checkValidVoucher(
        @GetUserId() userId: string,
        @Body() checkValidVoucherDto: CheckValidVoucherDto,
    ) {
        return await this.voucherService.checkValidVoucher(userId, checkValidVoucherDto);
    }

    @Post('apply-to-order')
    @ResponseMessage('Success')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async applyVoucherToOrder(@Body() applyVoucherDto: { orderId: string; voucherCode: string }) {
        return await this.voucherService.applyVoucherToOrder(
            applyVoucherDto.orderId,
            applyVoucherDto.voucherCode,
        );
    }

    @Get()
    @ResponseMessage('Get vouchers success')
    @HttpCode(HttpStatus.OK)
    async findAll() {
        return await this.voucherService.findAll();
    }

    @Get(':id')
    @ResponseMessage('Get voucher success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id') id: string) {
        return await this.voucherService.findOne(id);
    }

    @Patch(':id')
    @ResponseMessage('Update success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async update(@Param('id') id: string, @Body() updateVoucherDto: UpdateVoucherDto) {
        return await this.voucherService.update(id, updateVoucherDto);
    }

    @Delete(':id')
    @ResponseMessage('Delete success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string) {
        return await this.voucherService.remove(id);
    }

    @Patch('restore/:id')
    @ResponseMessage('Restore success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async restore(@Param('id') id: string) {
        return await this.voucherService.restore(id);
    }
}
