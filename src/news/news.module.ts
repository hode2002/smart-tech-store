import { Module } from '@nestjs/common';

import { MediaModule } from 'src/media/media.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import { NewsController } from './news.controller';
import { NewsService } from './news.service';

@Module({
    imports: [PrismaModule, MediaModule],
    controllers: [NewsController],
    providers: [NewsService],
})
export class NewsModule {}
