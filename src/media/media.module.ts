import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
    controllers: [MediaController],
    providers: [MediaService, CloudinaryService],
    exports: [MediaService],
})
export class MediaModule {}
