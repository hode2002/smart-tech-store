import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';
import { MediaModule } from '@v1/modules/media/media.module';

import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';

@Module({
    imports: [PrismaModule, MediaModule],
    controllers: [BrandController],
    providers: [BrandService],
})
export class BrandModule {}
