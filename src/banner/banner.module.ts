import { Module } from '@nestjs/common';

import { MediaModule } from 'src/media/media.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';

@Module({
    imports: [PrismaModule, MediaModule],
    controllers: [BannerController],
    providers: [BannerService],
})
export class BannerModule {}
