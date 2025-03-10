import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';
import { MediaModule } from '@v1/modules/media/media.module';

import { NewsController } from './news.controller';
import { NewsService } from './news.service';

@Module({
    imports: [PrismaModule, MediaModule],
    controllers: [NewsController],
    providers: [NewsService],
})
export class NewsModule {}
