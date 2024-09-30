import {
    Controller,
    HttpStatus,
    HttpCode,
    Post,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    UploadedFiles,
    Body,
    Delete,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { SuccessResponse } from 'src/common/response';
import { Permission } from 'src/common/decorators';
import { Role } from '@prisma/client';
import { AtJwtGuard } from 'src/auth/guards';
import { RoleGuard } from 'src/common/guards';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('api/v1/medias')
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}

    @Post('upload')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @UseInterceptors(FileInterceptor('image'))
    @HttpCode(HttpStatus.OK)
    async upload(
        @UploadedFile() file: Express.Multer.File,
        @Body('folder') folder?: string,
    ): Promise<SuccessResponse> {
        const result = await this.mediaService.uploadV2(file, folder);
        return {
            statusCode: HttpStatus.OK,
            message: 'Upload success',
            data: {
                is_success: result?.public_id ? true : false,
                key: result.url,
            },
        };
    }

    @Post('uploads')
    @Permission(Role.ADMIN)
    @UseGuards(AtJwtGuard, RoleGuard)
    @UseInterceptors(FilesInterceptor('images'))
    @HttpCode(HttpStatus.OK)
    async uploadMultiple(
        @UploadedFiles() files: Express.Multer.File[],
        @Body('folder') folder?: string,
    ): Promise<SuccessResponse> {
        const results = [];
        for (const file of files) {
            const res = await this.mediaService.uploadV2(file, folder);
            results.push({
                is_success: res?.public_id ? true : false,
                key: res.url,
            });
        }
        return {
            statusCode: HttpStatus.OK,
            message: 'Upload multiple success',
            data: results,
        };
    }

    @Delete()
    @HttpCode(HttpStatus.OK)
    async remove(@Body('filePath') filePath: string): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Delete file success',
            data: await this.mediaService.deleteV2(filePath),
        };
    }
}
