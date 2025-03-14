import { Module } from '@nestjs/common';

import { CloudinaryModule } from '@v2/modules/cloudinary/cloudinary.module';
import { CloudinaryService } from '@v2/modules/cloudinary/cloudinary.service';
import { STORAGE_PROVIDER } from '@v2/modules/media/constants';
import { IFileDelete } from '@v2/modules/media/interfaces';
import {
    MediaService,
    MediaUploadService,
    MediaDeleteService,
    ResourceTypeDetectorService,
} from '@v2/modules/media/services';

import { MediaController } from './media.controller';

@Module({
    imports: [CloudinaryModule],
    controllers: [MediaController],
    providers: [
        {
            provide: STORAGE_PROVIDER,
            useClass: CloudinaryService,
        },
        ResourceTypeDetectorService,
        MediaUploadService,

        {
            provide: MediaDeleteService,
            useFactory: (
                storageProvider: IFileDelete,
                resourceTypeDetector: ResourceTypeDetectorService,
            ) => {
                return new MediaDeleteService(storageProvider, resourceTypeDetector);
            },
            inject: [STORAGE_PROVIDER, ResourceTypeDetectorService],
        },

        {
            provide: MediaService,
            useFactory: (uploadService: MediaUploadService, deleteService: MediaDeleteService) => {
                return new MediaService(uploadService, deleteService);
            },
            inject: [MediaUploadService, MediaDeleteService],
        },
    ],
    exports: [MediaService],
})
export class MediaModule {}
