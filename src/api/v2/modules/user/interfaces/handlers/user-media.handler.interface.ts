import { MediaUploadResult } from '@v2/modules/media/types';

export interface IUserMediaHandler {
    uploadAvatar(file: Express.Multer.File): Promise<MediaUploadResult>;
    updateAvatar(oldImageUrl: string, newFile: Express.Multer.File): Promise<MediaUploadResult>;
}
