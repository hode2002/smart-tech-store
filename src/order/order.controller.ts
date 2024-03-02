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
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AtJwtGuard } from 'src/auth/guards';
import { SuccessResponse } from 'src/common/response';
import { GetUserId } from 'src/common/decorators';
import { OrderResponse } from './types';
import {
    CalculateShippingFeeDto,
    CreateOrderDto,
    UpdateOrderStatusDto,
} from './dto';

@Controller('api/v1/orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post()
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async create(
        @GetUserId() userId: string,
        @Body() createOrderDto: CreateOrderDto,
    ): Promise<SuccessResponse> {
        return {
            code: 201,
            status: 'Success',
            message: 'Create order success',
            data: await this.orderService.create(userId, createOrderDto),
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
            code: 200,
            status: 'Success',
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
            code: 201,
            status: 'Success',
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
            code: 200,
            status: 'Success',
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
    async findByStatus(
        @Param('status') status: string,
        @GetUserId() userId: string,
    ): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
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
            code: 200,
            status: 'Success',
            message: 'Update order status success',
            data: await this.orderService.updateStatus(
                id,
                userId,
                updateOrderStatusDto,
            ),
        };
    }
}
