import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

import { MAIL_QUEUE } from '@v2/modules/mail/constants';
import { IMailQueueService } from '@v2/modules/mail/interfaces';

@Injectable()
export class MailQueueService implements IMailQueueService {
    constructor(
        @InjectQueue(MAIL_QUEUE)
        private mailQueue: Queue,
    ) {}

    async addToQueue(type: string, data: any, options = {}) {
        const defaultOptions = {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000,
            },
        };

        await this.mailQueue.add(type, data, { ...defaultOptions, ...options });
    }
}
