import { BadRequestException, Injectable } from '@nestjs/common';

import { IStorageProvider } from '@v2/modules/media/interfaces';
import { MediaDeleteService, MediaUploadService } from '@v2/modules/media/services';
import {
    MediaFileInfo,
    MediaMultipleUploadResult,
    MediaUploadOptions,
    MediaUploadResult,
} from '@v2/modules/media/types';

@Injectable()
export class MediaService implements IStorageProvider {
    constructor(
        private readonly uploadService: MediaUploadService,
        private readonly deleteService: MediaDeleteService,
    ) {}

    async upload(
        file: Express.Multer.File,
        options?: MediaUploadOptions,
    ): Promise<MediaUploadResult> {
        return await this.uploadService.upload(file, options);
    }

    async uploadMultipleFiles(
        files: Express.Multer.File[],
        options?: MediaUploadOptions,
    ): Promise<MediaMultipleUploadResult> {
        if (!files || files.length === 0) {
            throw new BadRequestException('No files provided');
        }

        const uploadPromises = files.map(async file => {
            try {
                const result = await this.upload(file, options);
                return {
                    is_success: true,
                    file_name: file.originalname,
                    public_id: result?.public_id,
                    secure_url: result.secure_url || result.url,
                    resource_type: result.resource_type,
                    format: result.format,
                };
            } catch (error) {
                return {
                    is_success: false,
                    file_name: file.originalname,
                    error: error.message || 'Upload failed',
                };
            }
        });

        const results = await Promise.all(uploadPromises);
        const successCount = results.filter(r => r.is_success).length;

        return {
            total: files.length,
            success_count: successCount,
            failed_count: files.length - successCount,
            files: results as MediaFileInfo[],
        };
    }

    async delete(filePath: string): Promise<boolean> {
        if (!filePath) {
            throw new BadRequestException('File path is required');
        }

        return await this.deleteService.delete(filePath);
    }

    async deleteMultipleFiles(filePaths: string[]): Promise<MediaMultipleUploadResult> {
        if (!filePaths || filePaths.length === 0) {
            throw new BadRequestException('File paths are required');
        }

        const deletePromises = filePaths.map(async filePath => {
            try {
                const result = await this.delete(filePath);

                return {
                    file_path: filePath,
                    is_success: result,
                    error: result ? null : 'File not found or could not be deleted',
                };
            } catch (error) {
                return {
                    file_path: filePath,
                    is_success: false,
                    error: error.message || 'Delete failed',
                };
            }
        });

        const results = await Promise.all(deletePromises);
        const successCount = results.filter(r => r.is_success).length;

        return {
            total: filePaths.length,
            success_count: successCount,
            failed_count: filePaths.length - successCount,
            files: results as MediaFileInfo[],
        };
    }
}
