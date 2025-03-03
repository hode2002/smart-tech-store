import { Module } from '@nestjs/common';

import { MediaModule } from 'src/media/media.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
    imports: [PrismaModule, MediaModule],
    controllers: [ProductController],
    providers: [ProductService],
})
export class ProductModule {}
