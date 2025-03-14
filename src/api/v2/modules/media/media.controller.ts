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

import { ResponseMessage } from '@/common/decorators';
import { FileUploadInterceptor } from '@/common/interceptors';
import { AtJwtGuard } from '@v2/modules/auth/guards';
import { MediaMultipleUploadResult, MediaUploadResult } from '@v2/modules/media/types';

import { MediaService } from './services/media.service';

@Controller('media')
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}

    @Post('upload')
    @ResponseMessage('Image uploaded successfully')
    @UseGuards(AtJwtGuard)
    @UseInterceptors(FileUploadInterceptor.CustomSingleField('image'))
    @HttpCode(HttpStatus.OK)
    async uploadImage(
        @UploadedFile() file: Express.Multer.File,
        @Body('folder') folder?: string,
    ): Promise<Partial<MediaUploadResult>> {
        const result = await this.mediaService.upload(file, {
            folder,
            resource_type: 'image',
        });

        return {
            public_id: result?.public_id,
            secure_url: result.secure_url || result.url,
            resource_type: result.resource_type,
            format: result.format,
            message: result.message,
        };
    }

    @Post('uploads')
    @ResponseMessage('Images uploaded successfully')
    @UseGuards(AtJwtGuard)
    @UseInterceptors(FileUploadInterceptor.CustomField('images'))
    @HttpCode(HttpStatus.OK)
    async uploadMultiple(
        @UploadedFiles() files: Express.Multer.File[],
        @Body('folder') folder?: string,
    ): Promise<MediaMultipleUploadResult> {
        return this.mediaService.uploadMultipleFiles(files, {
            folder,
            resource_type: 'image',
        });
    }

    @Post('upload/video')
    @ResponseMessage('Video uploaded successfully')
    @UseGuards(AtJwtGuard)
    @UseInterceptors(FileUploadInterceptor.CustomSingleField('video'))
    @HttpCode(HttpStatus.OK)
    async uploadVideo(
        @UploadedFile() file: Express.Multer.File,
        @Body('folder') folder?: string,
    ): Promise<Partial<MediaUploadResult>> {
        const result = await this.mediaService.upload(file, {
            folder,
            resource_type: 'video',
        });
        return {
            public_id: result?.public_id,
            secure_url: result.secure_url || result.url,
            resource_type: result.resource_type,
            format: result.format,
            message: result.message,
        };
    }

    @Post('uploads/video')
    @ResponseMessage('Videos uploaded successfully')
    @UseGuards(AtJwtGuard)
    @UseInterceptors(FileUploadInterceptor.CustomField('videos', 10))
    @HttpCode(HttpStatus.OK)
    async uploadMultipleVideo(
        @UploadedFiles() files: Express.Multer.File[],
        @Body('folder') folder?: string,
    ): Promise<MediaMultipleUploadResult> {
        return this.mediaService.uploadMultipleFiles(files, {
            folder,
            resource_type: 'video',
        });
    }

    @Delete()
    @ResponseMessage('File deleted successfully')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Body('filePath') filePath: string): Promise<boolean> {
        return this.mediaService.delete(filePath);
    }

    @Delete('multiple')
    @ResponseMessage('Files deleted successfully')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async removeMultiple(
        @Body('filePaths') filePaths: string[],
    ): Promise<MediaMultipleUploadResult> {
        return this.mediaService.deleteMultipleFiles(filePaths);
    }
}
