import { Injectable, Inject } from '@nestjs/common';

import { generateOtp } from '@/common/utils';
import { UserProfile } from '@/prisma/selectors';
import { MAIL_SERVICE } from '@v2/modules/mail/constants';
import { IMailService } from '@v2/modules/mail/interfaces';
import { OTP_REPOSITORY } from '@v2/modules/otp/constants';
import { IOtpRepository, IOtpService } from '@v2/modules/otp/interfaces';

@Injectable()
export class OtpService implements IOtpService {
    constructor(
        @Inject(OTP_REPOSITORY)
        private readonly otpRepository: IOtpRepository,
        @Inject(MAIL_SERVICE)
        private readonly mailService: IMailService,
    ) {}

    async validateOtp(email: string, otp: string): Promise<boolean> {
        const isValid = await this.otpRepository.validate(email, otp);
        if (isValid) {
            await this.otpRepository.delete(email);
        }
        return isValid;
    }

    async storeOtp(email: string, otp: string): Promise<void> {
        await this.otpRepository.store(email, otp);
    }

    async sendOtp(user: UserProfile): Promise<void> {
        const otp = generateOtp();
        await Promise.all([
            this.storeOtp(user.email, otp),
            this.mailService.sendOtpCode(user, otp),
        ]);
    }
}
