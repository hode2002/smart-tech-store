import { Module } from '@nestjs/common';

import { MediaModule } from '@/api/v1/modules';
import { PrismaService } from '@/prisma/prisma.service';
import { BANNER_REPOSITORY, BannerRepository } from '@v2/modules/banner/repositories';

import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';

@Module({
    imports: [MediaModule],
    controllers: [BannerController],
    providers: [
        BannerService,
        {
            provide: BANNER_REPOSITORY,
            useClass: BannerRepository,
        },
        PrismaService,
    ],
})
export class BannerModule {}
