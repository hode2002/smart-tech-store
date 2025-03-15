import { Injectable } from '@nestjs/common';

import { IBrandMediaDeleteHandler } from '@v2/modules/brand/interfaces';
import { MediaService } from '@v2/modules/media';

@Injectable()
export class CloudinaryMediaDeleteHandler implements IBrandMediaDeleteHandler {
    constructor(private readonly mediaService: MediaService) {}

    async deleteLogo(fileUrl: string): Promise<boolean> {
        return this.mediaService.delete(fileUrl);
    }
}
