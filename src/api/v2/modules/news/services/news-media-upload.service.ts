import { Inject, Injectable } from '@nestjs/common';

import { NEWS_MEDIA_UPLOAD_HANDLER } from '@v2/modules/news/constants';
import { INewsMediaUploadHandler } from '@v2/modules/news/interfaces';

@Injectable()
export class NewsMediaUploadService {
    constructor(
        @Inject(NEWS_MEDIA_UPLOAD_HANDLER)
        private readonly mediaHandler: INewsMediaUploadHandler,
    ) {}

    async uploadImage(file: Express.Multer.File) {
        return this.mediaHandler.uploadImage(file);
    }

    async updateImage(oldImageUrl: string, newFile: Express.Multer.File) {
        return this.mediaHandler.updateImage(oldImageUrl, newFile);
    }
}
