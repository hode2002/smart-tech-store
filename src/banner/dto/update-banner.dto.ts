import { IsOptional, IsString } from 'class-validator';

export class UpdateBannerDto {
    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsString()
    link?: string;

    @IsOptional()
    @IsString()
    status?: string;
}
