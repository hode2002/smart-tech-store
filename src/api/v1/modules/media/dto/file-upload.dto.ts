import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FileUploadDto {
    @IsString()
    @IsNotEmpty()
    fieldname: string;

    @IsString()
    @IsNotEmpty()
    originalname: string;

    @IsString()
    @IsNotEmpty()
    encoding: string;

    @IsString()
    @IsNotEmpty()
    mimetype: string;

    @IsNotEmpty()
    buffer: Buffer;

    @IsNumber()
    @IsNotEmpty()
    size: number;
}
