import { Controller, Delete, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { MediaService } from './media.service';
import { SuccessResponse } from 'src/common/response';

@Controller('api/v1/medias')
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}

    @Delete()
    @HttpCode(HttpStatus.OK)
    async remove(@Body('media-key') key: string): Promise<SuccessResponse> {
        return {
            statusCode: HttpStatus.OK,
            message: 'Delete file success',
            data: await this.mediaService.deleteFileS3(key),
        };
    }
}
