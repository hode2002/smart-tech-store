import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateBannerDto {
    @ApiPropertyOptional({
        example: 'https://example.com',
        description: 'A link to product',
    })
    @IsOptional()
    @IsString()
    link?: string;

    @ApiPropertyOptional({
        example: 'show',
        description: 'Banner status',
    })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiPropertyOptional({
        example: 'slide',
        description: 'slide, big,...',
    })
    @IsOptional()
    @IsString()
    type?: string;
}
