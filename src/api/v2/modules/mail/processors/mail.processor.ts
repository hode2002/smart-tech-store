import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { MAIL_PROCESS, MAIL_QUEUE } from '@v2/modules/mail/constants';
import { MailTemplateService } from '@v2/modules/mail/services/mail-template.service';

@Processor(MAIL_QUEUE)
export class MailProcessor {
    private readonly POSTMARK_API_URL = 'https://api.postmarkapp.com/email/withTemplate';
    constructor(private readonly mailTemplateService: MailTemplateService) {}

    // @Process('send-otp')
    // async handleSendMail(job: Job) {
    //     const { user, otpCode } = job.data;
    //     const createDate = moment(user.created_at).format('DD/MM/YYYY');

    //     try {
    //         const response = await axios.post(
    //             this.POSTMARK_API_URL,
    //             {
    //                 From: process.env.POSTMARK_FROM_EMAIL,
    //                 to: user.email,
    //                 subject: 'Smart Tech - Your OTP Code',
    //                 TemplateId: 39432572,
    //                 TemplateModel: {
    //                     email: user.email,
    //                     otpCode,
    //                     createDate,
    //                     subject: 'Smart Tech - Your OTP Code',
    //                 },
    //             },
    //             {
    //                 headers: {
    //                     'X-Postmark-Server-Token': process.env.POSTMARK_API_KEY,
    //                     'Content-Type': 'application/json',
    //                 },
    //             },
    //         );

    //         console.log(`✅ Email sent to ${user.email}:`, response.data);
    //     } catch (error) {
    //         console.error(
    //             `❌ Failed to send email to ${user.email}:`,
    //             error.response?.data || error.message,
    //         );
    //     }
    // }

    @Process(MAIL_PROCESS.SEND_OTP)
    async handleSendOtpCode(job: Job) {
        const { user, otpCode } = job.data;

        await this.mailTemplateService.sendMail({
            to: user.email,
            subject: 'Smart Tech - Your OTP Code',
            template: './otp',
            context: {
                email: user.email,
                otpCode,
            },
        });
    }

    @Process(MAIL_PROCESS.SEND_NEW_PASSWORD)
    async handleSendNewPassword(job: Job) {
        const { user, newPassword } = job.data;

        await this.mailTemplateService.sendMail({
            to: user.email,
            subject: 'Smart Tech - Your New Password',
            template: './new-password',
            context: {
                email: user.email,
                newPassword,
            },
        });
    }

    @Process(MAIL_PROCESS.ORDER_CONFIRMATION)
    async handleOrderConfirmation(job: Job) {
        const { user, order } = job.data;

        await this.mailTemplateService.sendMail({
            to: user.email,
            subject: 'Smart Tech - Order Confirmation',
            template: './order-confirmation',
            context: {
                email: user.email,
                orderId: order.id,
                orderDate: order.created_at,
                total: order.total,
                items: order.items,
            },
        });
    }
}
