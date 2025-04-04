import { MediaUploadResult } from '@v2/modules/media/types';

export interface IProductMediaHandler {
    uploadImage(file: Express.Multer.File): Promise<MediaUploadResult>;
    updateImage(oldImageUrl: string, newFile: Express.Multer.File): Promise<MediaUploadResult>;
    deleteImage(imageUrl: string): Promise<boolean>;
}
