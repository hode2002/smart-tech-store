import { ApiProperty } from '@nestjs/swagger';
import { BannerStatus } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBannerDto {
    @ApiProperty({
        description: 'Banner title',
        example: 'Banner title',
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        description: 'Banner link',
        example: 'https://example.com',
    })
    @IsString()
    @IsNotEmpty()
    link: string;

    @ApiProperty({
        description: 'Banner image url',
        example: 'https://example.com',
    })
    @IsString()
    @IsNotEmpty()
    image_url: string;

    @ApiProperty({
        description: 'Banner status',
        example: 'show',
    })
    @IsString()
    @IsNotEmpty()
    status: BannerStatus;

    @ApiProperty({
        description: 'Banner alt text',
        example: 'Banner alt text',
    })
    @IsString()
    @IsOptional()
    alt_text?: string;

    @ApiProperty({
        description: 'Banner position',
        example: 'home',
    })
    @IsString()
    @IsNotEmpty()
    position: string;

    @ApiProperty({
        description: 'Banner display order',
        example: 1,
    })
    @IsNumber()
    @IsOptional()
    display_order?: number;

    @ApiProperty({
        description: 'Banner start date',
        example: '2025-04-01',
    })
    @IsString()
    @IsNotEmpty()
    start_date: string;

    @ApiProperty({
        description: 'Banner end date',
        example: '2025-05-01',
    })
    @IsString()
    @IsNotEmpty()
    end_date: string;
}
