import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';
import { MediaModule } from '@v1/modules/media/media.module';

import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';

@Module({
    imports: [PrismaModule, MediaModule],
    controllers: [BannerController],
    providers: [BannerService],
})
export class BannerModule {}
