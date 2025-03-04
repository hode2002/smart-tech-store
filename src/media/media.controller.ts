import {
    Body,
    Controller,
    Delete,
    HttpCode,
    HttpStatus,
    Post,
    UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { AtJwtGuard } from 'src/auth/guards';
import { ResponseMessage } from 'src/common/decorators';

import { MediaService } from './media.service';

@Controller('medias')
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}

    @Post('upload/video')
    @ResponseMessage('Upload success')
    @UseGuards(AtJwtGuard)
    @UseInterceptors(FileInterceptor('video'))
    @HttpCode(HttpStatus.OK)
    async uploadVideo(@UploadedFile() file: Express.Multer.File, @Body('folder') folder?: string) {
        const result = await this.mediaService.uploadV2(file, folder, 'video');
        return {
            is_success: result?.public_id ? true : false,
            key: result.url,
        };
    }

    @Post('uploads/video')
    @ResponseMessage('Upload multiple success')
    @UseGuards(AtJwtGuard)
    @UseInterceptors(FilesInterceptor('videos'))
    @HttpCode(HttpStatus.OK)
    async uploadMultipleVideo(
        @UploadedFiles() files: Express.Multer.File[],
        @Body('folder') folder?: string,
    ) {
        const results = [];
        for (const file of files) {
            const res = await this.mediaService.uploadV2(file, folder, 'video');
            results.push({
                is_success: res?.public_id ? true : false,
                key: res.url,
            });
        }
        return results;
    }

    @Post('upload')
    @ResponseMessage('Upload success')
    @UseGuards(AtJwtGuard)
    @UseInterceptors(FileInterceptor('image'))
    @HttpCode(HttpStatus.OK)
    async upload(@UploadedFile() file: Express.Multer.File, @Body('folder') folder?: string) {
        const result = await this.mediaService.uploadV2(file, folder);
        return {
            is_success: result?.public_id ? true : false,
            key: result.url,
        };
    }

    @Post('uploads')
    @ResponseMessage('Upload multiple success')
    @UseGuards(AtJwtGuard)
    @UseInterceptors(FilesInterceptor('images'))
    @HttpCode(HttpStatus.OK)
    async uploadMultiple(
        @UploadedFiles() files: Express.Multer.File[],
        @Body('folder') folder?: string,
    ) {
        const results = [];
        for (const file of files) {
            const res = await this.mediaService.uploadV2(file, folder);
            results.push({
                is_success: res?.public_id ? true : false,
                key: res.url,
            });
        }
        return results;
    }

    @Delete()
    @ResponseMessage('Delete file success')
    @HttpCode(HttpStatus.OK)
    async remove(@Body('filePath') filePath: string) {
        return await this.mediaService.deleteV2(filePath);
    }
}
