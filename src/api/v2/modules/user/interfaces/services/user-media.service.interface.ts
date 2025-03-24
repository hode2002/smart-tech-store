import { MediaUploadResult } from '@/api/v2/modules/media/types';

export interface IUserMediaService {
    updateAvatar(oldImageUrl: string, file: Express.Multer.File): Promise<MediaUploadResult>;
}
