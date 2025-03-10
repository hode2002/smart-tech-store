import { IsOptional, IsString } from 'class-validator';

export class UpdateBannerDto {
    @IsOptional()
    @IsString()
    link?: string;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsString()
    type?: string;
}
