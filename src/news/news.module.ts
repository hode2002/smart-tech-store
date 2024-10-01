import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MediaModule } from 'src/media/media.module';

@Module({
    imports: [PrismaModule, MediaModule],
    controllers: [NewsController],
    providers: [NewsService],
})
export class NewsModule {}
