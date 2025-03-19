import { Inject, Injectable } from '@nestjs/common';

import { BANNER_MEDIA_DELETE_HANDLER } from '@v2/modules/banner/constants';
import {
    IBannerMediaDeleteHandler,
    IBannerMediaUploadHandler,
} from '@v2/modules/banner/interfaces';
import { MediaService } from '@v2/modules/media';
import { MediaUploadResult } from '@v2/modules/media/types';

@Injectable()
export class BannerMediaUploadHandler implements IBannerMediaUploadHandler {
    private readonly FOLDER = 'banners';
    private readonly RESOURCE_TYPE = 'image';

    constructor(
        private readonly mediaService: MediaService,
        @Inject(BANNER_MEDIA_DELETE_HANDLER)
        private readonly mediaDeleteHandler: IBannerMediaDeleteHandler,
    ) {}

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
            this.mediaDeleteHandler.deleteImage(oldImageUrl),
        ]);
        return uploadResult;
    }
}
