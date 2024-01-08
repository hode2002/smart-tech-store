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
import { BannerService } from './banner.service';
import { CreateBannerDto, UpdateBannerDto } from './dto';
import { Permission } from 'src/common/decorators';
import { Role } from '@prisma/client';
import { AtJwtGuard } from 'src/auth/guards';
import { RoleGuard } from 'src/common/guards';
import { SuccessResponse } from 'src/common/response';

@Controller('api/v1/banners')
@Permission(Role.ADMIN)
@UseGuards(AtJwtGuard, RoleGuard)
export class BannerController {
    constructor(private readonly bannerService: BannerService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() createBannerDto: CreateBannerDto,
    ): Promise<SuccessResponse> {
        return {
            code: 201,
            status: 'Success',
            message: 'Create success',
            data: await this.bannerService.create(createBannerDto),
        };
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Get all banners success',
            data: await this.bannerService.findAll(),
        };
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findById(@Param('id') id: string) {
        return {
            code: 200,
            status: 'Success',
            message: 'Get banner success',
            data: await this.bannerService.findById(+id),
        };
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id') id: string,
        @Body() updateBannerDto: UpdateBannerDto,
    ) {
        return {
            code: 200,
            status: 'Success',
            message: 'Update success',
            data: await this.bannerService.update(+id, updateBannerDto),
        };
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string) {
        return {
            code: 200,
            status: 'Success',
            message: 'Remove success',
            data: await this.bannerService.remove(+id),
        };
    }
}
