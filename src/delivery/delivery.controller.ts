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
import { Permission, ResponseMessage } from 'src/common/decorators';
import { RoleGuard } from 'src/common/guards';

import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';

@Controller('api/v1/delivery')
export class DeliveryController {
    constructor(private readonly deliveryService: DeliveryService) {}

    @Post()
    @ResponseMessage('Create success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createDeliveryDto: CreateDeliveryDto) {
        return await this.deliveryService.create(createDeliveryDto);
    }

    @Get()
    @ResponseMessage('Get all delivery success')
    @HttpCode(HttpStatus.OK)
    async findAll() {
        return await this.deliveryService.findAll();
    }

    @Get('admin')
    @ResponseMessage('Get all delivery success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async adminFindAll() {
        return await this.deliveryService.adminFindAll();
    }

    @Get(':id')
    @ResponseMessage('Get delivery by id success')
    @HttpCode(HttpStatus.OK)
    async findById(@Param('id') id: string) {
        return await this.deliveryService.findById(id);
    }

    @Patch(':id')
    @ResponseMessage('Update delivery success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async update(@Param('id') id: string, @Body() updateDeliveryDto: UpdateDeliveryDto) {
        return await this.deliveryService.update(id, updateDeliveryDto);
    }

    @Delete(':id')
    @ResponseMessage('Remove delivery success')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string) {
        return await this.deliveryService.remove(id);
    }
}
