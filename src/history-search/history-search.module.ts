import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { MediaModule } from 'src/media/media.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from 'src/user/user.service';

import { HistorySearchController } from './history-search.controller';
import { HistorySearchService } from './history-search.service';

@Module({
    imports: [
        PrismaModule,
        BullModule.registerQueue({
            name: 'send-mail',
        }),
        MediaModule,
    ],
    controllers: [HistorySearchController],
    providers: [HistorySearchService, UserService],
    exports: [HistorySearchService],
})
export class HistorySearchModule {}
