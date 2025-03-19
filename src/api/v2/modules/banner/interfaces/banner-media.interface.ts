export interface IBannerMediaUploadHandler {
    uploadImage(file: Express.Multer.File): Promise<any>;
    updateImage(oldImageUrl: string, newFile: Express.Multer.File): Promise<any>;
}

export interface IBannerMediaDeleteHandler {
    deleteImage(imageUrl: string): Promise<boolean>;
}

export interface IBannerMediaHandler extends IBannerMediaUploadHandler, IBannerMediaDeleteHandler {}
