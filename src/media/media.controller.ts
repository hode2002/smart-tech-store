import { Controller, Delete, Body } from '@nestjs/common';
import { MediaService } from './media.service';
import { SuccessResponse } from 'src/common/response';

@Controller('api/v1/medias')
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}

    @Delete()
    async remove(@Body('media-key') key: string): Promise<SuccessResponse> {
        return {
            code: 200,
            status: 'Success',
            message: 'Delete file success',
            data: await this.mediaService.deleteFileS3(key),
        };
    }
}
