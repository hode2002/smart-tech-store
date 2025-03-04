import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Role } from '@prisma/client';
import { Request, Response } from 'express';

import { AtJwtGuard } from 'src/auth/guards';
import { GetUserId, Permission, ResponseMessage } from 'src/common/decorators';
import { RoleGuard } from 'src/common/guards';
import { CreateOrderComboDto } from 'src/order/dto/create-order-combo';

import {
    CalculateShippingFeeDto,
    CreateOrderDto,
    UpdateOrderStatusDto,
    UpdatePaymentStatusDto,
} from './dto';
import { AdminUpdateOrderStatusDto } from './dto/admin-update-order-status.dto';
import { OrderService } from './order.service';
import { OrderResponse } from './types';

@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get()
    @ResponseMessage('Get all orders success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async getAll() {
        return await this.orderService.findAll();
    }

    @Get('/admin')
    @ResponseMessage('Get all orders success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async getAllByAdmin() {
        return await this.orderService.getAllByAdmin();
    }

    @Post()
    @ResponseMessage('Create order success')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(@GetUserId() userId: string, @Body() createOrderDto: CreateOrderDto) {
        return await this.orderService.create(userId, createOrderDto);
    }

    @Post('combos')
    @ResponseMessage('Create order success')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.CREATED)
    async createOrderCombo(
        @GetUserId() userId: string,
        @Body() createOrderComboDto: CreateOrderComboDto,
    ) {
        return await this.orderService.createOrderCombo(userId, createOrderComboDto);
    }

    @Post('vnpay')
    @ResponseMessage('Payment url')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async vnpayPayment(@Req() req: Request, @Res() res: Response) {
        return await this.orderService.vnpayCreatePayment(req, res);
    }

    @Patch('payment/:id')
    @ResponseMessage('Payment url')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async updatePaymentStatus(
        @Param('id') id: string,
        @Body() updatePaymentStatusDto: UpdatePaymentStatusDto,
    ) {
        return await this.orderService.updatePaymentStatus(id, updatePaymentStatusDto);
    }

    @Post('cancel/:id')
    @ResponseMessage('Cancel order success')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async cancel(@GetUserId() userId: string, @Param('id') id: string) {
        return await this.orderService.cancel(userId, id);
    }

    @Post('shipping/fee')
    @ResponseMessage('Get shipping fee success')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async calculateShippingFee(@Body() calculateShippingFeeDto: CalculateShippingFeeDto) {
        return await this.orderService.calculateShippingFee(calculateShippingFeeDto);
    }

    @Get(':id')
    @ResponseMessage('Get order by id success')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async findById(@Param('id') id: string, @GetUserId() userId: string) {
        return (await this.orderService.findById(userId, id)) as OrderResponse;
    }

    @Get('status/:status')
    @ResponseMessage('Get order by status success')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 50, ttl: 60000 } })
    async findByStatus(@Param('status') status: string, @GetUserId() userId: string) {
        return await this.orderService.findByStatus(userId, +status);
    }

    @Patch(':id/status')
    @ResponseMessage('Update order status success')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async updateStatus(
        @Param('id') id: string,
        @GetUserId() userId: string,
        @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    ) {
        return await this.orderService.updateStatus(id, userId, updateOrderStatusDto);
    }

    @Patch(':id/status/admin')
    @ResponseMessage('Update order status success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async updateStatusByAdmin(
        @Param('id') id: string,
        @Body() updateOrderStatusDto: AdminUpdateOrderStatusDto,
    ) {
        return await this.orderService.updateStatusByAdmin(id, updateOrderStatusDto);
    }
}
