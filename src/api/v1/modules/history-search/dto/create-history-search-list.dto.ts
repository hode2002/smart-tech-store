import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHistorySearchListDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    search_content: string;
}
