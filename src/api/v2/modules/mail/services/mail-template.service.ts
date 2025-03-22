import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { IMailOptions } from '@v2/modules/mail/interfaces';

@Injectable()
export class MailTemplateService {
    constructor(private readonly mailerService: MailerService) {}

    async sendMail(options: IMailOptions): Promise<void> {
        await this.mailerService.sendMail(options);
    }
}
