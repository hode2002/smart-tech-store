export interface IBrandMediaUploadHandler {
    uploadLogo(file: Express.Multer.File, options?: any): Promise<any>;
    updateLogo(oldFileUrl: string, newFile: Express.Multer.File, options?: any): Promise<any>;
}

export interface IBrandMediaDeleteHandler {
    deleteLogo(fileUrl: string): Promise<boolean>;
}

export interface IBrandMediaHandler extends IBrandMediaUploadHandler, IBrandMediaDeleteHandler {}
