import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNewsDto {
    @ApiProperty({
        description: 'Title of the news article',
        example: 'Breaking News: New Technology Emerges',
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        description: 'Content of the news article',
        example: 'Today, a new technology was unveiled that promises to change the world...',
    })
    @IsString()
    @IsNotEmpty()
    content: string;
}
