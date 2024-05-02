import {
    Controller,
    Delete,
    Body,
    HttpStatus,
    HttpCode,
    Post,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    UploadedFiles,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { SuccessResponse } from 'src/common/response';
import { Permission } from 'src/common/decorators';
import { Role } from '@prisma/client';
import { AtJwtGuard } from 'src/auth/guards';
import { RoleGuard } from 'src/common/guards';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from 'src/media/dto';

@Controller('api/v1/medias')
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}

    @Post('upload')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @UseInterceptors(FileInterceptor('image'))
    @HttpCode(HttpStatus.OK)
    async upload(
        @UploadedFile() fileUploadDto: FileUploadDto,
    ): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Upload success',
            data: await this.mediaService.upload(fileUploadDto),
        };
    }

    @Post('uploads')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @UseInterceptors(FilesInterceptor('images'))
    @HttpCode(HttpStatus.OK)
    async uploadMultiple(
        @UploadedFiles() filesUploadDto: FileUploadDto[],
    ): Promise<SuccessResponse> {
        const results = [];
        for (const file of filesUploadDto) {
            results.push(await this.mediaService.upload(file));
        }
        return {
            statusCode: HttpStatus.OK,
            message: 'Upload multiple success',
            data: results,
        };
    }

    @Delete()
    @HttpCode(HttpStatus.OK)
    async remove(@Body('media-key') key: string): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Delete file success',
            data: await this.mediaService.deleteFileS3(key),
        };
    }
}
