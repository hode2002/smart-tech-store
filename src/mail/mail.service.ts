import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';

@Injectable()
@Processor('send-mail')
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    @Process('send-otp')
    async sendOtpCode(job: Job<any>) {
        return await this.mailerService.sendMail({
            to: job.data['email'],
            subject: 'Mã xác thực OTP',
            html: `
                Smart Tech Store <br></br>
                Mã OTP của bạn là: <b>${job.data['otpCode']}</b>
            `,
        });
    }

    @Process('send-new-pass')
    async sendNewPass(job: Job<any>) {
        return await this.mailerService.sendMail({
            to: job.data['email'],
            subject: 'Thay đổi mật khẩu',
            html: `
                Smart Tech Store <br></br>
                Mật khẩu mới của bạn là: <b>${job.data['newPass']}</b>
            `,
        });
    }
}
