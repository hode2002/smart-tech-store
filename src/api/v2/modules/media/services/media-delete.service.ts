import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { STORAGE_PROVIDER } from '@v2/modules/media/constants';
import { IFileDelete } from '@v2/modules/media/interfaces';
import { ResourceTypeDetectorService } from '@v2/modules/media/services';
import { MediaDeleteOptions } from '@v2/modules/media/types';

@Injectable()
export class MediaDeleteService implements IFileDelete {
    constructor(
        @Inject(STORAGE_PROVIDER)
        private readonly storageProvider: IFileDelete,
        private readonly resourceTypeDetector: ResourceTypeDetectorService,
    ) {}

    async delete(filePath: string): Promise<boolean> {
        if (!filePath) {
            throw new BadRequestException('File path is required');
        }

        const resourceType = this.resourceTypeDetector.detect(filePath);
        const defaultOptions: MediaDeleteOptions = {
            folder: '',
            resource_type: resourceType,
        };

        return await this.storageProvider.delete(filePath, {
            ...defaultOptions,
        });
    }
}
