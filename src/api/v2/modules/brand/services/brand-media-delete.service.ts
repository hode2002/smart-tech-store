import { Inject, Injectable } from '@nestjs/common';

import { BRAND_MEDIA_DELETE_HANDLER } from '@v2/modules/brand/constants';
import { IBrandMediaDeleteHandler } from '@v2/modules/brand/interfaces';

@Injectable()
export class BrandMediaDeleteService {
    constructor(
        @Inject(BRAND_MEDIA_DELETE_HANDLER)
        private mediaHandler: IBrandMediaDeleteHandler,
    ) {}

    async deleteLogo(logoUrl: string) {
        return this.mediaHandler.deleteLogo(logoUrl);
    }
}
