import { Injectable } from '@nestjs/common';

import { MediaService } from '@v2/modules/media';
import { MediaUploadResult } from '@v2/modules/media/types';
import { IProductMediaHandler } from '@v2/modules/product/interfaces';

@Injectable()
export class ProductMediaHandler implements IProductMediaHandler {
    private readonly FOLDER = 'products';
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
        const uploadResult = await this.uploadImage(newFile);

        if (oldImageUrl) {
            await this.mediaService.delete(oldImageUrl);
        }

        return uploadResult;
    }

    async deleteImage(imageUrl: string): Promise<boolean> {
        return this.mediaService.delete(imageUrl);
    }
}
