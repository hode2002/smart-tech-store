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
        @UploadedFile() file: Express.Multer.File,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Create success',
            data: await this.brandService.create(createBrandDto, file),
        };
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
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
            statusCode: HttpStatus.OK,
            message: 'Get all brands success',
            data: await this.brandService.adminFindAll(),
        };
    }
    @Get('category/:slug')
    @HttpCode(HttpStatus.OK)
    async findByCategory(
        @Param('slug') slug: string,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Get brand success',
            data: await this.brandService.findByCategory(slug),
        };
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findById(@Param('id') id: string): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
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
        @UploadedFile() file: Express.Multer.File,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Update success',
            data: await this.brandService.update(id, updateBrandDto, file),
        };
    }

    @Delete(':id')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Delete success',
            data: await this.brandService.remove(id),
        };
    }

    @Post('restore/:id')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @HttpCode(HttpStatus.OK)
    async restore(@Param('id') id: string): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Restore success',
            data: await this.brandService.restore(id),
        };
    }
}
