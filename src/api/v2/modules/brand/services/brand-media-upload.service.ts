import { Inject, Injectable } from '@nestjs/common';

import { BRAND_MEDIA_UPLOAD_HANDLER } from '@v2/modules/brand/constants';
import { IBrandMediaUploadHandler } from '@v2/modules/brand/interfaces';

@Injectable()
export class BrandMediaUploadService {
    constructor(
        @Inject(BRAND_MEDIA_UPLOAD_HANDLER)
        private mediaHandler: IBrandMediaUploadHandler,
    ) {}

    async uploadLogo(file: Express.Multer.File) {
        return this.mediaHandler.uploadLogo(file);
    }

    async updateLogo(oldLogoUrl: string, newFile: Express.Multer.File) {
        return this.mediaHandler.updateLogo(oldLogoUrl, newFile);
    }
}
