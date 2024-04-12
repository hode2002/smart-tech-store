import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHistorySearchDto {
    @IsString()
    @IsNotEmpty()
    search_content: string;
}
