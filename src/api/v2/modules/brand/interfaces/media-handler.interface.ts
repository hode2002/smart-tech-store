import { MediaUploadOptions, MediaUploadResult } from '@v2/modules/media/types';
export interface IBrandMediaUploadHandler {
    uploadLogo(file: Express.Multer.File, options?: MediaUploadOptions): Promise<MediaUploadResult>;
    updateLogo(
        oldFileUrl: string,
        newFile: Express.Multer.File,
        options?: MediaUploadOptions,
    ): Promise<MediaUploadResult>;
}

export interface IBrandMediaDeleteHandler {
    deleteLogo(fileUrl: string): Promise<boolean>;
}

export interface IBrandMediaHandler extends IBrandMediaUploadHandler, IBrandMediaDeleteHandler {}
