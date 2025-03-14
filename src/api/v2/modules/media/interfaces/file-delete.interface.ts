import { MediaUploadOptions } from '@v2/modules/media/types';

export interface IFileDelete {
    delete(filePath: string, options?: MediaUploadOptions): Promise<boolean>;
}
