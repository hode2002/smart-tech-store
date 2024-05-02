import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MediaModule } from 'src/media/media.module';

@Module({
    imports: [PrismaModule, MediaModule],
    controllers: [ProductController],
    providers: [ProductService],
})
export class ProductModule {}
