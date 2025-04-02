import { Inject, Injectable } from '@nestjs/common';

import { BRAND_TOKENS } from '@v2/modules/brand/constants';
import { IBrandMediaDeleteHandler, IBrandMediaDeleteService } from '@v2/modules/brand/interfaces';

@Injectable()
export class BrandMediaDeleteService implements IBrandMediaDeleteService {
    constructor(
        @Inject(BRAND_TOKENS.HANDLERS.MEDIA_DELETE)
        private mediaHandler: IBrandMediaDeleteHandler,
    ) {}

    async deleteLogo(logoUrl: string) {
        return this.mediaHandler.deleteLogo(logoUrl);
    }
}
