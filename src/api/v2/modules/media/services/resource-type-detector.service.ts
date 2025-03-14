import { Injectable } from '@nestjs/common';

import { CloudinaryResourceType } from '@v2/modules/cloudinary/types';

@Injectable()
export class ResourceTypeDetectorService {
    detect(filePath: string): CloudinaryResourceType {
        if (filePath.includes('/video/') || filePath.endsWith('.mp4')) {
            return 'video';
        }
        if (filePath.includes('/raw/')) {
            return 'raw';
        }
        return 'image';
    }
}
