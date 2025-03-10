import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';
import { MediaModule } from '@v1/modules/media/media.module';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [
        PrismaModule,
        BullModule.registerQueue({
            name: 'send-mail',
        }),
        MediaModule,
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
