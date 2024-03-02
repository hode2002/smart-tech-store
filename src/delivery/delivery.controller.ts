import {
    Controller,
    Body,
    Delete,
    HttpCode,
    HttpStatus,
    UseGuards,
    Param,
    Post,
    Patch,
    Get,
} from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { AtJwtGuard } from 'src/auth/guards';
import { Permission } from 'src/common/decorators';
import { SuccessResponse } from 'src/common/response';
import { RoleGuard } from 'src/common/guards';
import { Role } from '@prisma/client';

import { DeliveryService } from './delivery.service';

@Controller('api/v1/delivery')
export class DeliveryController {
    constructor(private readonly deliveryService: DeliveryService) {}

    @Post()
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async create(
        @Body() createDeliveryDto: CreateDeliveryDto,
    ): Promise<SuccessResponse> {
        return {
            code: 201,
            status: 'Success',
            message: 'Create success',
            data: await this.deliveryService.create(createDeliveryDto),
        };
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Get all delivery success',
            data: await this.deliveryService.findAll(),
        };
    }

    @Get('admin')
    @HttpCode(HttpStatus.OK)
    async adminFindAll(): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Get all delivery success',
            data: await this.deliveryService.adminFindAll(),
        };
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findById(@Param('id') id: string): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Get delivery by id success',
            data: await this.deliveryService.findById(id),
        };
    }

    @Patch(':id')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id') id: string,
        @Body() updateDeliveryDto: UpdateDeliveryDto,
    ): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Get all delivery success',
            data: await this.deliveryService.update(id, updateDeliveryDto),
        };
    }

    @Delete(':id')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Remove delivery success',
            data: await this.deliveryService.remove(id),
        };
    }
}
