import { Inject, Injectable } from '@nestjs/common';

import { BANNER_MEDIA_UPLOAD_HANDLER } from '@v2/modules/banner/constants';
import { IBannerMediaUploadHandler } from '@v2/modules/banner/interfaces';

@Injectable()
export class BannerMediaUploadService {
    constructor(
        @Inject(BANNER_MEDIA_UPLOAD_HANDLER)
        private mediaHandler: IBannerMediaUploadHandler,
    ) {}

    async uploadImage(file: Express.Multer.File) {
        return this.mediaHandler.uploadImage(file);
    }

    async updateImage(oldImageUrl: string, newFile: Express.Multer.File) {
        return this.mediaHandler.updateImage(oldImageUrl, newFile);
    }
}
