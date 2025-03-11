import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsOptional, IsInt, Min, Max } from 'class-validator';

export class PaginationDto {
    @ApiPropertyOptional({
        example: 1,
        description: 'Page number (default: 1)',
        type: 'number',
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    @Transform(({ value }) => parseInt(value, 10) || 1)
    page = 1;

    @ApiPropertyOptional({
        example: 10,
        description: 'Number of records per page (default: 10, max: 100)',
        type: 'number',
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    @Transform(({ value }) => parseInt(value, 10) || 10)
    limit = 10;
}
