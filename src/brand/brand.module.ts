import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MediaModule } from 'src/media/media.module';

@Module({
    imports: [PrismaModule, MediaModule],
    controllers: [BrandController],
    providers: [BrandService],
})
export class BrandModule {}
