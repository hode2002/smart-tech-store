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
import { BrandService } from './brand.service';
import { CreateBrandDto, UpdateBrandDto } from './dto';
import { Permission } from 'src/common/decorators';
import { Role } from '@prisma/client';
import { AtJwtGuard } from 'src/auth/guards';
import { RoleGuard } from 'src/common/guards';
import { SuccessResponse } from 'src/common/response';

@Controller('api/v1/brands')
@Permission(Role.ADMIN)
@UseGuards(AtJwtGuard, RoleGuard)
export class BrandController {
    constructor(private readonly brandService: BrandService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() createBrandDto: CreateBrandDto,
    ): Promise<SuccessResponse> {
        return {
            code: 201,
            status: 'Success',
            message: 'Create success',
            data: await this.brandService.create(createBrandDto),
        };
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Get all brands success',
            data: await this.brandService.findAll(),
        };
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findById(@Param('id') id: string): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Get brand success',
            data: await this.brandService.findById(+id),
        };
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id') id: string,
        @Body() updateBrandDto: UpdateBrandDto,
    ): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Update success',
            data: await this.brandService.update(+id, updateBrandDto),
        };
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Delete success',
            data: await this.brandService.remove(+id),
        };
    }
}
