import { Inject, Injectable } from '@nestjs/common';

import { BRAND_TOKENS } from '@v2/modules/brand/constants';
import { IBrandMediaUploadHandler, IBrandMediaUploadService } from '@v2/modules/brand/interfaces';

@Injectable()
export class BrandMediaUploadService implements IBrandMediaUploadService {
    constructor(
        @Inject(BRAND_TOKENS.HANDLERS.MEDIA_UPLOAD)
        private mediaHandler: IBrandMediaUploadHandler,
    ) {}

    async uploadLogo(file: Express.Multer.File) {
        return this.mediaHandler.uploadLogo(file);
    }

    async updateLogo(oldLogoUrl: string, newFile: Express.Multer.File) {
        return this.mediaHandler.updateLogo(oldLogoUrl, newFile);
    }
}
