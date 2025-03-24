import { Injectable, UnsupportedMediaTypeException } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Injectable()
export class FileUploadInterceptor {
    static CustomField(fieldName: string, maxFiles = 10) {
        const allowedMimeTypes = process.env.ALLOWED_MIME_TYPES?.split(',') || [
            'image/png',
            'image/jpeg',
            'video/mp4',
        ];

        const maxSizeMB = Number(process.env.MAX_FILE_SIZE_MB) || 5;

        return FilesInterceptor(fieldName, maxFiles, {
            limits: { fileSize: maxSizeMB * 1024 * 1024 },
            fileFilter: (req, file, cb) => {
                if (!allowedMimeTypes.includes(file.mimetype)) {
                    return cb(
                        new UnsupportedMediaTypeException(
                            `Only ${allowedMimeTypes.join(', ')} files are allowed!`,
                        ),
                        false,
                    );
                }
                cb(null, true);
            },
        });
    }

    static CustomSingleField(fieldName: string) {
        const allowedMimeTypes = process.env.ALLOWED_MIME_TYPES?.split(',') || [
            'image/png',
            'image/jpeg',
            'video/mp4',
        ];

        const maxSizeMB = Number(process.env.MAX_FILE_SIZE_MB) || 5;

        return FileInterceptor(fieldName, {
            limits: { fileSize: maxSizeMB * 1024 * 1024 },
            fileFilter: (req, file, cb) => {
                if (!allowedMimeTypes.includes(file.mimetype)) {
                    return cb(
                        new UnsupportedMediaTypeException(
                            `Only ${allowedMimeTypes.join(', ')} files are allowed!`,
                        ),
                        false,
                    );
                }
                cb(null, true);
            },
        });
    }
}
