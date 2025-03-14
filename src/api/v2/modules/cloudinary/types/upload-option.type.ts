import { CloudinaryResourceType } from '@v2/modules/cloudinary/types';

export type CloudinaryUploadOptions = {
    folder?: string;
    public_id?: string;
    resource_type?: CloudinaryResourceType;
};
