import { MediaUploadResult } from '@v2/modules/media/types';

export interface IBannerMediaUploadHandler {
    uploadImage(file: Express.Multer.File): Promise<MediaUploadResult>;
    updateImage(oldImageUrl: string, newFile: Express.Multer.File): Promise<MediaUploadResult>;
}

export interface IBannerMediaDeleteHandler {
    deleteImage(imageUrl: string): Promise<boolean>;
}

export interface IBannerMediaHandler extends IBannerMediaUploadHandler, IBannerMediaDeleteHandler {}
