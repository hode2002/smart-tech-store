import {
    MediaMultipleUploadResult,
    MediaUploadOptions,
    MediaUploadResult,
} from '@v2/modules/media/types';

export interface IFileUpload {
    upload(file: Express.Multer.File, options?: MediaUploadOptions): Promise<MediaUploadResult>;
}

export interface IFileUploadMultiple {
    uploadMultiple(
        files: Express.Multer.File[],
        options?: MediaUploadOptions,
    ): Promise<MediaMultipleUploadResult>;
}
