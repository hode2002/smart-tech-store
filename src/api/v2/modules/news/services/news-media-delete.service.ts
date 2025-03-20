import { Inject, Injectable } from '@nestjs/common';

import { NEWS_MEDIA_DELETE_HANDLER } from '@v2/modules/news/constants';
import { INewsMediaDeleteHandler } from '@v2/modules/news/interfaces';

@Injectable()
export class NewsMediaDeleteService {
    constructor(
        @Inject(NEWS_MEDIA_DELETE_HANDLER)
        private readonly mediaHandler: INewsMediaDeleteHandler,
    ) {}

    async deleteImage(imageUrl: string) {
        return this.mediaHandler.deleteImage(imageUrl);
    }
}
