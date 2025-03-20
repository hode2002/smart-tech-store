import { Injectable } from '@nestjs/common';

import { MediaService } from '@v2/modules/media';
import { MediaUploadResult } from '@v2/modules/media/types';
import { INewsMediaUploadHandler } from '@v2/modules/news/interfaces';

@Injectable()
export class NewsMediaUploadHandler implements INewsMediaUploadHandler {
    private readonly FOLDER = 'news';
    private readonly RESOURCE_TYPE = 'image';

    constructor(private readonly mediaService: MediaService) {}

    async uploadImage(file: Express.Multer.File): Promise<MediaUploadResult> {
        return this.mediaService.upload(file, {
            folder: this.FOLDER,
            resource_type: this.RESOURCE_TYPE,
        });
    }

    async updateImage(
        oldImageUrl: string,
        newFile: Express.Multer.File,
    ): Promise<MediaUploadResult> {
        const [uploadResult] = await Promise.all([
            this.uploadImage(newFile),
            this.mediaService.delete(oldImageUrl),
        ]);
        return uploadResult;
    }
}
