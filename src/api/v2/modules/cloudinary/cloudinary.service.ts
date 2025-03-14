import { Readable } from 'stream';

import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';

import { CloudinaryUploadOptions } from '@v2/modules/cloudinary/types';

import { CloudinaryResponse } from './cloudinary';

@Injectable()
export class CloudinaryService {
    constructor(private readonly configService: ConfigService) {}

    upload(
        file: Express.Multer.File,
        options?: CloudinaryUploadOptions,
    ): Promise<CloudinaryResponse> {
        if (!file?.buffer) {
            throw new BadRequestException('File not found');
        }

        const folderName = `${this.configService.get('CLOUDINARY_FOLDER_NAME')}/${options?.folder}`;

        const uploadOptions: UploadApiOptions = {
            folder: folderName,
            resource_type: options?.resource_type || 'image',
        };

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                uploadOptions,
                (error, result) => {
                    if (error) {
                        return reject(
                            new InternalServerErrorException(
                                `Cloudinary upload failed: ${error.message}`,
                            ),
                        );
                    }
                    resolve(result);
                },
            );

            Readable.from(file.buffer).pipe(uploadStream);
        });
    }

    async delete(filePath: string, options?: CloudinaryUploadOptions): Promise<boolean> {
        try {
            const folderName = this.configService.get<string>('CLOUDINARY_FOLDER_NAME') || '';

            if (!filePath.includes(folderName)) {
                throw new Error('Invalid file path');
            }

            const arr = filePath.split(folderName);
            const ext = filePath.split('.').pop() || '';

            if (!ext) {
                throw new Error('Invalid file extension');
            }

            const displayName = arr[arr.length - 1].split(`.${ext}`)[0];
            const publicId = `${folderName}${displayName}`;

            const result = await cloudinary.uploader.destroy(publicId, {
                resource_type: options?.resource_type || 'image',
            });

            return result.result === 'ok';
        } catch (error) {
            console.error('Cloudinary delete error:', error);
            return false;
        }
    }
}
