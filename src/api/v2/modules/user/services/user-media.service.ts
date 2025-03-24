import { Inject, Injectable } from '@nestjs/common';

import { USER_TOKENS } from '@v2/modules/user/constants';
import { IUserMediaService, IUserMediaHandler } from '@v2/modules/user/interfaces';

@Injectable()
export class UserMediaService implements IUserMediaService {
    constructor(
        @Inject(USER_TOKENS.HANDLERS.USER_MEDIA_HANDLER)
        private readonly mediaHandler: IUserMediaHandler,
    ) {}

    async updateAvatar(oldImageUrl: string, file: Express.Multer.File) {
        return this.mediaHandler.updateAvatar(oldImageUrl, file);
    }
}
