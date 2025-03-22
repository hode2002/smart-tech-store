import { Injectable, Inject } from '@nestjs/common';
import { User } from '@prisma/client';

import { MAIL_PROCESS, MAIL_QUEUE_SERVICE } from '@v2/modules/mail/constants';
import { IMailQueueService, IMailService } from '@v2/modules/mail/interfaces';

@Injectable()
export class MailService implements IMailService {
    constructor(
        @Inject(MAIL_QUEUE_SERVICE)
        private readonly mailQueueService: IMailQueueService,
    ) {}

    async sendOtpCode(user: User, otpCode: string): Promise<void> {
        await this.mailQueueService.addToQueue(MAIL_PROCESS.SEND_OTP, { user, otpCode });
    }

    async sendNewPassword(user: User, newPassword: string): Promise<void> {
        await this.mailQueueService.addToQueue(MAIL_PROCESS.SEND_NEW_PASSWORD, {
            user,
            newPassword,
        });
    }

    async sendOrderConfirmation(user: User, order: any): Promise<void> {
        await this.mailQueueService.addToQueue(MAIL_PROCESS.ORDER_CONFIRMATION, { user, order });
    }
}
