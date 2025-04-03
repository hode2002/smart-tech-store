import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateHistorySearchDto {
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsOptional()
    category_id?: string;
}
