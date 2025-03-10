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

import { Permission, ResponseMessage } from '@/common/decorators';
import { RoleGuard } from '@/common/guards';
import { AtJwtGuard } from '@v1/modules/auth/guards';

import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto, UpdateDeliveryDto } from './dto';

@Controller('delivery')
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
