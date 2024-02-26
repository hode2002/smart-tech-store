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
import { BrandService } from './brand.service';
import { CreateBrandDto, UpdateBrandDto } from './dto';
import { Permission } from 'src/common/decorators';
import { Role } from '@prisma/client';
import { AtJwtGuard } from 'src/auth/guards';
import { RoleGuard } from 'src/common/guards';
import { SuccessResponse } from 'src/common/response';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from 'src/media/dto';

@Controller('api/v1/brands')
export class BrandController {
    constructor(private readonly brandService: BrandService) {}

    @Post()
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @UseInterceptors(FileInterceptor('logo_url'))
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() createBrandDto: CreateBrandDto,
        @UploadedFile() fileUploadDto: FileUploadDto,
    ): Promise<SuccessResponse> {
        return {
            code: 201,
            status: 'Success',
            message: 'Create success',
            data: await this.brandService.create(createBrandDto, fileUploadDto),
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

    @Get('admin')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async adminFindAll(): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Get all brands success',
            data: await this.brandService.adminFindAll(),
        };
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findById(@Param('id') id: string): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Get brand success',
            data: await this.brandService.findById(id),
        };
    }

    @Patch(':id')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @UseInterceptors(FileInterceptor('logo_url'))
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id') id: string,
        @Body() updateBrandDto: UpdateBrandDto,
        @UploadedFile() fileUploadDto: FileUploadDto,
    ): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Update success',
            data: await this.brandService.update(
                id,
                updateBrandDto,
                fileUploadDto,
            ),
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
            message: 'Delete success',
            data: await this.brandService.remove(id),
        };
    }
}
