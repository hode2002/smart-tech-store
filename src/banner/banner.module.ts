import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MediaModule } from 'src/media/media.module';

@Module({
    imports: [PrismaModule, MediaModule],
    controllers: [BannerController],
    providers: [BannerService],
})
export class BannerModule {}
