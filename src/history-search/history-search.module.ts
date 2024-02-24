import { Module } from '@nestjs/common';
import { HistorySearchService } from './history-search.service';
import { HistorySearchController } from './history-search.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from 'src/user/user.service';
import { BullModule } from '@nestjs/bull';
import { MediaModule } from 'src/media/media.module';

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
