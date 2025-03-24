import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHistorySearchListDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    content: string;
}
