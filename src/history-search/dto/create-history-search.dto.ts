import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHistorySearchDto {
    @IsString()
    @IsNotEmpty()
    content: string;
}
