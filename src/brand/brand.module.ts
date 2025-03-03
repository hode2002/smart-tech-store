import { Module } from '@nestjs/common';

import { MediaModule } from 'src/media/media.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';

@Module({
    imports: [PrismaModule, MediaModule],
    controllers: [BrandController],
    providers: [BrandService],
})
export class BrandModule {}
