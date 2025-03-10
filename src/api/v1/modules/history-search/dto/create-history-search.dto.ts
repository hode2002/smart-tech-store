import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateHistorySearchDto {
    @IsString()
    @IsOptional()
    id?: string;

    @IsString()
    @IsNotEmpty()
    search_content: string;
}
