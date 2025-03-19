import { Inject, Injectable } from '@nestjs/common';

import { BANNER_MEDIA_DELETE_HANDLER } from '@v2/modules/banner/constants';
import { IBannerMediaDeleteHandler } from '@v2/modules/banner/interfaces';

@Injectable()
export class BannerMediaDeleteService {
    constructor(
        @Inject(BANNER_MEDIA_DELETE_HANDLER)
        private mediaHandler: IBannerMediaDeleteHandler,
    ) {}

    async deleteImage(imageUrl: string) {
        return this.mediaHandler.deleteImage(imageUrl);
    }
}
