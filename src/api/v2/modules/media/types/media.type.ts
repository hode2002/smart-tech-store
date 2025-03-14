import { CloudinaryResponse } from '@v2/modules/cloudinary/cloudinary';
import { CloudinaryResourceType, CloudinaryUploadOptions } from '@v2/modules/cloudinary/types';

export type MediaUploadOptions = CloudinaryUploadOptions;
export type MediaDeleteOptions = CloudinaryUploadOptions;

export type MediaUploadResult = CloudinaryResponse;

export type MediaUploadError = {
    message: string;
    code?: string;
    details?: any;
};

export type MediaFileInfo = {
    is_success: boolean;
    secure_url: string;
    public_id?: string;
    file_path?: string;
    resource_type?: CloudinaryResourceType;
    format?: string;
    error?: MediaUploadError;
    file_name?: string;
};

export type MediaMultipleUploadResult = {
    total: number;
    success_count: number;
    failed_count: number;
    files: MediaFileInfo[];
};
