import { MediaUploadResult } from '@v2/modules/media/types';

export interface IBrandMediaUploadService {
    uploadLogo(file: Express.Multer.File): Promise<MediaUploadResult>;
    updateLogo(oldLogoUrl: string, newFile: Express.Multer.File): Promise<MediaUploadResult>;
}

export interface IBrandMediaDeleteService {
    deleteLogo(logoUrl: string): Promise<boolean>;
}
