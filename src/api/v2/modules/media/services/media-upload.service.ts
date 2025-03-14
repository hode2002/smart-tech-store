import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';

import { STORAGE_PROVIDER } from '@v2/modules/media/constants';
import { IFileUpload } from '@v2/modules/media/interfaces';
import { MediaUploadOptions, MediaUploadResult } from '@v2/modules/media/types';

@Injectable()
export class MediaUploadService implements IFileUpload {
    constructor(
        @Inject(STORAGE_PROVIDER)
        private readonly storageProvider: IFileUpload,
    ) {}

    async upload(
        file: Express.Multer.File,
        options: MediaUploadOptions = {},
    ): Promise<MediaUploadResult> {
        try {
            if (!file) {
                throw new BadRequestException('File not found');
            }
            const defaultOptions: MediaUploadOptions = {
                folder: '',
                resource_type: 'image',
            };

            return await this.storageProvider.upload(file, {
                ...defaultOptions,
                ...options,
            });
        } catch (error) {
            throw new InternalServerErrorException(`Failed to upload file: ${error.message}`);
        }
    }
}
