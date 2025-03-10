import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';
import { MediaModule } from '@v1/modules/media/media.module';
import { UserService } from '@v1/modules/user/user.service';

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
