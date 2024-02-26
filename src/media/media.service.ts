import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { AwsS3DataDto, FileUploadDto } from './dto';
import { generateSlug } from 'src/utils';

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
            ACL: 'public-read', // comment if private file
        };

        return new Promise((resolve, reject) => {
            s3.upload(params, (err: Error, data: AwsS3DataDto) => {
                if (err) {
                    reject();
                    throw new InternalServerErrorException(
                        'Internal Server Error',
                    );
                }
                resolve(data);
            });
        });
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
            accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
        });
    }
}
