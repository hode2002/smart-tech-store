import { Inject, Injectable } from '@nestjs/common';

import { BRAND_MEDIA_DELETE_HANDLER } from '@v2/modules/brand/constants';
import { IBrandMediaDeleteHandler, IBrandMediaUploadHandler } from '@v2/modules/brand/interfaces';
import { CloudinaryResponse } from '@v2/modules/cloudinary/cloudinary';
import { MediaService } from '@v2/modules/media';

@Injectable()
export class CloudinaryMediaUploadHandler implements IBrandMediaUploadHandler {
    private readonly FOLDER = 'brands';
    private readonly RESOURCE_TYPE = 'image';

    constructor(
        private readonly mediaService: MediaService,
        @Inject(BRAND_MEDIA_DELETE_HANDLER)
        private readonly mediaDeleteHandler: IBrandMediaDeleteHandler,
    ) {}

    async uploadLogo(file: Express.Multer.File): Promise<CloudinaryResponse> {
        return this.mediaService.upload(file, {
            folder: this.FOLDER,
            resource_type: this.RESOURCE_TYPE,
        });
    }

    async updateLogo(
        oldFileUrl: string,
        newFile: Express.Multer.File,
    ): Promise<CloudinaryResponse> {
        const [uploadResult] = await Promise.all([
            this.uploadLogo(newFile),
            this.mediaDeleteHandler.deleteLogo(oldFileUrl),
        ]);
        return uploadResult;
    }
}
