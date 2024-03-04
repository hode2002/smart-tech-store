import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReplyReviewDto {
    @IsString()
    @IsNotEmpty()
    comment: string;
}
