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
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { BannerService } from './banner.service';
import { CreateBannerDto, UpdateBannerDto } from './dto';
import { Permission } from 'src/common/decorators';
import { Role } from '@prisma/client';
import { AtJwtGuard } from 'src/auth/guards';
import { RoleGuard } from 'src/common/guards';
import { SuccessResponse } from 'src/common/response';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from 'src/media/dto';

@Controller('api/v1/banners')
export class BannerController {
    constructor(private readonly bannerService: BannerService) {}

    @Post()
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @UseInterceptors(FileInterceptor('image'))
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() createBannerDto: CreateBannerDto,
        @UploadedFile() fileUploadDto: FileUploadDto,
    ): Promise<SuccessResponse> {
        return {
            code: 201,
            status: 'Success',
            message: 'Create success',
            data: await this.bannerService.create(
                createBannerDto,
                fileUploadDto,
            ),
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
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
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
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @UseInterceptors(FileInterceptor('image'))
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id') id: string,
        @Body() updateBannerDto: UpdateBannerDto,
        @UploadedFile() fileUploadDto: FileUploadDto,
    ) {
        return {
            code: 200,
            status: 'Success',
            message: 'Update success',
            data: await this.bannerService.update(
                +id,
                updateBannerDto,
                fileUploadDto,
            ),
        };
    }

    @Delete(':id')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
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
