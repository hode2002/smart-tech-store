import * as fs from 'fs';

import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Job } from 'bull';
import handleBars from 'handlebars';
import * as moment from 'moment';
@Injectable()
@Processor('send-mail')
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    @Process('send-otp')
    async sendOtpCode(job: Job<any>) {
        const templatePath = 'src/templates/otp-template.html';
        const subject = 'Mã xác thực OTP';
        const replacements = {
            email: job.data['email'],
            otpCode: job.data['otpCode'],
            content: `Cảm ơn bạn đã chọn Smart Tech Store. 
                        Dùng mã OTP bên dưới để hoàn thành quá trình đăng ký tài khoản. 
                        Mã OTP có hiệu lực trong vòng 5 phút.
                        Không chia sẽ mã này cho bất kỳ người nào khác.`,
        };
        return await this.send(job, subject, templatePath, replacements);
    }

    @Process('send-new-pass')
    async sendNewPass(job: Job<any>) {
        const templatePath = 'src/templates/send-new-pass-template.html';
        const subject = 'Thay đổi mật khẩu';
        const replacements = {
            email: job.data['email'],
            newPass: job.data['newPass'],
            content: `Cảm ơn bạn đã sử dụng dịch vụ của Smart Tech Store. Mật khẩu mới của bạn là`,
        };
        return await this.send(job, subject, templatePath, replacements);
    }

    async send(job: any, subject: string, templatePath: string, replacements: any) {
        const date = new Date();
        const createDate = moment(date).format('DD/MM/YYYY');
        const source = fs.readFileSync(templatePath, 'utf8').toString();
        const template = handleBars.compile(source);
        const htmlToSend = template({ ...replacements, createDate, subject });
        return await this.mailerService.sendMail({
            to: job.data['email'],
            subject,
            html: htmlToSend,
        });
    }
}
