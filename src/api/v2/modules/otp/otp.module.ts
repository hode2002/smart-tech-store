import { Module } from '@nestjs/common';

import { CacheModule } from '@v2/modules/cache/cache.module';
import { CacheService } from '@v2/modules/cache/cache.service';
import { CommonModule } from '@v2/modules/common/common.module';
import { MAIL_SERVICE } from '@v2/modules/mail/constants';
import { MailModule } from '@v2/modules/mail/mail.module';
import { MailService } from '@v2/modules/mail/services/mail.service';
import { OTP_REPOSITORY } from '@v2/modules/otp/constants';
import { OtpRepository } from '@v2/modules/otp/repositories';
import { OtpService } from '@v2/modules/otp/services/otp.service';

@Module({
    imports: [CacheModule.register({ ttl: 300 }), CommonModule, MailModule],
    providers: [
        CacheService,
        {
            provide: MAIL_SERVICE,
            useClass: MailService,
        },
        {
            provide: OTP_REPOSITORY,
            useClass: OtpRepository,
        },
        OtpService,
    ],
    exports: [OtpService],
})
export class OtpModule {}
