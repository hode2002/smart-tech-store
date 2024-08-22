import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { FileUploadDto } from './dto';
import { generateSlug } from 'src/utils';
import { Upload } from '@aws-sdk/lib-storage';
import { S3, ObjectCannedACL } from '@aws-sdk/client-s3';

@Injectable()
export class MediaService {
    constructor(private readonly configService: ConfigService) {}

    async upload(
        file: FileUploadDto,
    ): Promise<{ is_success: boolean; key: string }> {
        const uuid = randomBytes(8).toString('hex');
        const arr_name = file.originalname.split('.');
        const extension = arr_name.pop();
        const name = arr_name.join('.');
        const key = uuid + '/' + generateSlug(name) + '.' + extension;

        await this.uploadS3(file.buffer, key, file.mimetype);

        return {
            is_success: true,
            key: this.configService.get('AWS_BASE_URL') + key,
        };
    }

    private async uploadS3(
        file_buffer: Buffer,
        key: string,
        content_type: string,
    ) {
        const s3 = this.createInstanceS3();
        const params = {
            Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
            Key: key,
            Body: file_buffer,
            ContentType: content_type,
            ACL: 'public-read' as ObjectCannedACL, // comment if private file
        };

        const parallelUploads3 = new Upload({
            client: s3,
            params,
        });

        const result = await parallelUploads3.done();
        if (result?.$metadata.httpStatusCode !== 200) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async deleteFileS3(key: string) {
        const s3 = this.createInstanceS3();
        const params = {
            Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
            Key: key.replace(this.configService.get('AWS_BASE_URL'), '').trim(),
        };

        // eslint-disable-next-line
        s3.deleteObject(params, (err, data) => {});

        return {
            is_success: true,
        };
    }

    private createInstanceS3() {
        return new S3({
            region: this.configService.get('AWS_REGION'),
            credentials: {
                accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get(
                    'AWS_SECRET_ACCESS_KEY',
                ),
            },
        });
    }
}
