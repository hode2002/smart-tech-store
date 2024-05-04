import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    UseGuards,
    HttpStatus,
    HttpCode,
    Req,
    Res,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AtJwtGuard } from 'src/auth/guards';
import { SuccessResponse } from 'src/common/response';
import { GetUserId, Permission } from 'src/common/decorators';
import { OrderResponse } from './types';
import {
    CalculateShippingFeeDto,
    CreateOrderDto,
    UpdateOrderStatusDto,
    UpdatePaymentStatusDto,
} from './dto';
import { Request, Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { Role } from '@prisma/client';
import { RoleGuard } from 'src/common/guards';
import { AdminUpdateOrderStatusDto } from './dto/admin-update-order-status.dto';

@Controller('api/v1/orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get()
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async getAll(): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Get all orders success',
            data: await this.orderService.findAll(),
        };
    }

    @Get('/admin')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async getAllByAdmin(): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Get all orders success',
            data: await this.orderService.getAllByAdmin(),
        };
    }

    @Post()
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(
        @GetUserId() userId: string,
        @Body() createOrderDto: CreateOrderDto,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Create order success',
            data: await this.orderService.create(userId, createOrderDto),
        };
    }

    @Post('vnpay')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async vnpayPayment(
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Payment url',
            data: await this.orderService.vnpayCreatePayment(req, res),
        };
    }

    @Patch('payment/:id')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async updatePaymentStatus(
        @Param('id') id: string,
        @Body() updatePaymentStatusDto: UpdatePaymentStatusDto,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Payment url',
            data: await this.orderService.updatePaymentStatus(
                id,
                updatePaymentStatusDto,
            ),
        };
    }

    @Post('cancel/:id')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async cancel(
        @GetUserId() userId: string,
        @Param('id') id: string,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Cancel order success',
            data: await this.orderService.cancel(userId, id),
        };
    }

    @Post('shipping/fee')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async calculateShippingFee(
        @Body() calculateShippingFeeDto: CalculateShippingFeeDto,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Get shipping fee success',
            data: await this.orderService.calculateShippingFee(
                calculateShippingFeeDto,
            ),
        };
    }

    @Get(':id')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async findById(
        @Param('id') id: string,
        @GetUserId() userId: string,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Get order by id success',
            data: (await this.orderService.findById(
                userId,
                id,
            )) as OrderResponse,
        };
    }

    @Get('status/:status')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 50, ttl: 60000 } })
    async findByStatus(
        @Param('status') status: string,
        @GetUserId() userId: string,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Get order by status success',
            data: await this.orderService.findByStatus(userId, +status),
        };
    }

    @Patch(':id/status')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async updateStatus(
        @Param('id') id: string,
        @GetUserId() userId: string,
        @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Update order status success',
            data: await this.orderService.updateStatus(
                id,
                userId,
                updateOrderStatusDto,
            ),
        };
    }

    @Patch(':id/status/admin')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async updateStatusByAdmin(
        @Param('id') id: string,
        @Body() updateOrderStatusDto: AdminUpdateOrderStatusDto,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Update order status success',
            data: await this.orderService.updateStatusByAdmin(
                id,
                updateOrderStatusDto,
            ),
        };
    }
}
