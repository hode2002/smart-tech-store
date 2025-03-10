import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';
import { MediaModule } from '@v1/modules/media/media.module';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
    imports: [PrismaModule, MediaModule],
    controllers: [ProductController],
    providers: [ProductService],
})
export class ProductModule {}
