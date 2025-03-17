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
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiConsumes,
    ApiBody,
    ApiBearerAuth,
} from '@nestjs/swagger';

import { ResponseMessage } from '@/common/decorators';
import { FileUploadInterceptor } from '@/common/interceptors';
import { AtJwtGuard } from '@v2/modules/auth/guards';
import { MediaMultipleUploadResult, MediaUploadResult } from '@v2/modules/media/types';

import { MediaService } from './services/media.service';

@ApiTags('Media')
@ApiBearerAuth()
@Controller('media')
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}

    @ApiOperation({ summary: 'Upload single image' })
    @ApiResponse({ status: 200, description: 'Image uploaded successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                image: {
                    type: 'string',
                    format: 'binary',
                },
                folder: {
                    type: 'string',
                    example: 'images',
                },
            },
        },
    })
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

    @ApiOperation({ summary: 'Upload multiple images' })
    @ApiResponse({ status: 200, description: 'Images uploaded successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                images: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
                folder: {
                    type: 'string',
                    example: 'images',
                },
            },
        },
    })
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

    @ApiOperation({ summary: 'Upload single video' })
    @ApiResponse({ status: 200, description: 'Video uploaded successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                video: {
                    type: 'string',
                    format: 'binary',
                },
                folder: {
                    type: 'string',
                    example: 'videos',
                },
            },
        },
    })
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

    @ApiOperation({ summary: 'Upload multiple videos' })
    @ApiResponse({ status: 200, description: 'Videos uploaded successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                videos: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
                folder: {
                    type: 'string',
                    example: 'videos',
                },
            },
        },
    })
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

    @ApiOperation({ summary: 'Delete single file' })
    @ApiResponse({ status: 200, description: 'File deleted successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                filePath: {
                    type: 'string',
                    example: 'images/example.jpg',
                },
            },
        },
    })
    @Delete()
    @ResponseMessage('File deleted successfully')
    @UseGuards(AtJwtGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Body('filePath') filePath: string): Promise<boolean> {
        return this.mediaService.delete(filePath);
    }

    @ApiOperation({ summary: 'Delete multiple files' })
    @ApiResponse({ status: 200, description: 'Files deleted successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                filePaths: {
                    type: 'array',
                    items: {
                        type: 'string',
                        example: 'images/example.jpg',
                    },
                },
            },
        },
    })
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
