import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { MAIL_QUEUE, MAIL_QUEUE_SERVICE } from '@v2/modules/mail/constants';
import { MailProcessor } from '@v2/modules/mail/processors/mail.processor';
import { MailQueueService } from '@v2/modules/mail/services/mail-queue.service';
import { MailTemplateService } from '@v2/modules/mail/services/mail-template.service';
import { MailService } from '@v2/modules/mail/services/mail.service';

@Module({
    imports: [
        MailerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                transport: {
                    host: configService.get('MAIL_HOST'),
                    secure: false,
                    auth: {
                        user: configService.get('MAIL_USER'),
                        pass: configService.get('MAIL_PASSWORD'),
                    },
                },
                defaults: {
                    from: `"Smart Tech" <${configService.get('MAIL_FROM')}>`,
                },
                template: {
                    dir: 'src/api/v2/modules/mail/templates/',
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
        }),
        BullModule.registerQueue({
            name: MAIL_QUEUE,
        }),
    ],
    providers: [
        MailService,
        MailQueueService,
        MailTemplateService,
        MailProcessor,
        {
            provide: MAIL_QUEUE_SERVICE,
            useClass: MailQueueService,
        },
    ],
    exports: [MailService, MAIL_QUEUE_SERVICE],
})
export class MailModule {}
