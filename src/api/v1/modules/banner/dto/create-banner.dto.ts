import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBannerDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    link: string;

    @IsString()
    @IsOptional()
    type?: string;
}
