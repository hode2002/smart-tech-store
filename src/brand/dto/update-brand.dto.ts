import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateBrandDto {
    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    is_deleted?: boolean;
}
