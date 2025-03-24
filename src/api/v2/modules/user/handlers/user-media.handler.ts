import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MediaService } from '@v2/modules/media';
import { MediaUploadResult } from '@v2/modules/media/types';
import { IUserMediaHandler } from '@v2/modules/user/interfaces';

@Injectable()
export class UserMediaHandler implements IUserMediaHandler {
    private readonly FOLDER = 'avatars';
    private readonly RESOURCE_TYPE = 'image';

    constructor(
        private readonly configService: ConfigService,
        private readonly mediaService: MediaService,
    ) {}

    async uploadAvatar(file: Express.Multer.File): Promise<MediaUploadResult> {
        return this.mediaService.upload(file, {
            folder: this.FOLDER,
            resource_type: this.RESOURCE_TYPE,
        });
    }

    async updateAvatar(
        oldImageUrl: string,
        newFile: Express.Multer.File,
    ): Promise<MediaUploadResult> {
        const uploadResult = await this.uploadAvatar(newFile);
        if (oldImageUrl && !oldImageUrl.includes(this.configService.get('DEFAULT_AVATAR'))) {
            await this.mediaService.delete(oldImageUrl);
        }

        return uploadResult;
    }
}
