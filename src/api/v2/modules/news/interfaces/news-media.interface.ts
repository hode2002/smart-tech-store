import { MediaUploadResult } from '@v2/modules/media/types';

export interface INewsMediaUploadHandler {
    uploadImage(file: Express.Multer.File): Promise<MediaUploadResult>;
    updateImage(oldThumbnail: string, newFile: Express.Multer.File): Promise<MediaUploadResult>;
}

export interface INewsMediaDeleteHandler {
    deleteImage(thumbnail: string): Promise<boolean>;
}

export interface INewsMediaHandler extends INewsMediaUploadHandler, INewsMediaDeleteHandler {}
