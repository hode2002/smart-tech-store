import { IFileDelete, IFileUpload } from '@v2/modules/media/interfaces';

export interface IStorageProvider extends IFileUpload, IFileDelete {}
