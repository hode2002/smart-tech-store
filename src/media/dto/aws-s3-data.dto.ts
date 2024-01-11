import { IsNotEmpty, IsString } from 'class-validator';

export class AwsS3DataDto {
    @IsString()
    @IsNotEmpty()
    ETag: string;

    @IsString()
    @IsNotEmpty()
    ServerSideEncryption: string;

    @IsString()
    @IsNotEmpty()
    Location: string;

    @IsString()
    @IsNotEmpty()
    key: string;

    @IsString()
    @IsNotEmpty()
    Key: string;

    @IsString()
    @IsNotEmpty()
    Bucket: string;
}
