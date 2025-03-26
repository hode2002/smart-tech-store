import { Injectable } from '@nestjs/common';

import { MediaService } from '@v2/modules/media';
import { IReviewMediaService } from '@v2/modules/review/interfaces';

@Injectable()
export class ReviewMediaService implements IReviewMediaService {
    constructor(private readonly mediaService: MediaService) {}

    async delete(url: string): Promise<boolean> {
        return this.mediaService.delete(url);
    }
}
