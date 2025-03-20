import { Injectable } from '@nestjs/common';

import { MediaService } from '@v2/modules/media';
import { INewsMediaDeleteHandler } from '@v2/modules/news/interfaces';

@Injectable()
export class NewsMediaDeleteHandler implements INewsMediaDeleteHandler {
    constructor(private readonly mediaService: MediaService) {}

    async deleteImage(fileUrl: string): Promise<boolean> {
        return this.mediaService.delete(fileUrl);
    }
}
