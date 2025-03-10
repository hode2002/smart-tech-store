import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

import { MailService } from './mail.service';

@Module({
    imports: [
        MailerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                transport: configService.get('MAIL_TRANSPORT'),
                defaults: {
                    from: `"No Reply" <${configService.get('MAIL_FROM')}>`,
                },
            }),
        }),
    ],
    controllers: [],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}
