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
import { VoucherService } from './voucher.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { GetUserId, Permission } from 'src/common/decorators';
import { Role } from '@prisma/client';
import { AtJwtGuard } from 'src/auth/guards';
import { RoleGuard } from 'src/common/guards';
import { SuccessResponse } from 'src/common/response';
import { CheckValidVoucherDto } from 'src/voucher/dto/check-valid-voucher.dto';

@Controller('/api/v1/vouchers')
export class VoucherController {
    constructor(private readonly voucherService: VoucherService) {}

    @Post()
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() createVoucherDto: CreateVoucherDto,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Create success',
            data: await this.voucherService.create(createVoucherDto),
        };
    }

    @Post('check')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async checkValidVoucher(
        @GetUserId() userId: string,
        @Body() checkValidVoucherDto: CheckValidVoucherDto,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Success',
            data: await this.voucherService.checkValidVoucher(
                userId,
                checkValidVoucherDto,
            ),
        };
    }

    @Post('apply-to-order')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async applyVoucherToOrder(
        @Body() applyVoucherDto: { orderId: string; voucherCode: string },
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Success',
            data: await this.voucherService.applyVoucherToOrder(
                applyVoucherDto.orderId,
                applyVoucherDto.voucherCode,
            ),
        };
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Get vouchers success',
            data: await this.voucherService.findAll(),
        };
    }

    @Get(':id')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id') id: string): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Get voucher success',
            data: await this.voucherService.findOne(id),
        };
    }

    @Patch(':id')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id') id: string,
        @Body() updateVoucherDto: UpdateVoucherDto,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Update success',
            data: await this.voucherService.update(id, updateVoucherDto),
        };
    }

    @Delete(':id')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Delete success',
            data: await this.voucherService.remove(id),
        };
    }

    @Patch('restore/:id')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async restore(@Param('id') id: string): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Restore success',
            data: await this.voucherService.restore(id),
        };
    }
}
