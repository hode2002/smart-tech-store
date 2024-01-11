import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
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
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
