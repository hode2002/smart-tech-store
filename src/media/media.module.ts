import { Module } from '@nestjs/common';

import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
    controllers: [MediaController],
    providers: [MediaService, CloudinaryService],
    exports: [MediaService],
})
export class MediaModule {}
