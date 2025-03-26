import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReplyReviewDto {
    @ApiProperty({ description: 'Comment for the reply', type: String })
    @IsString()
    @IsNotEmpty()
    comment: string;
}
