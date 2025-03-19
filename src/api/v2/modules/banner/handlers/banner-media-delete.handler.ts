import { Injectable } from '@nestjs/common';

import { IBannerMediaDeleteHandler } from '@v2/modules/banner/interfaces';
import { MediaService } from '@v2/modules/media';

@Injectable()
export class BannerMediaDeleteHandler implements IBannerMediaDeleteHandler {
    constructor(private readonly mediaService: MediaService) {}

    async deleteImage(fileUrl: string): Promise<boolean> {
        return this.mediaService.delete(fileUrl);
    }
}
