import { UserProfile } from '@/prisma/selectors';

export interface IMailContext {
    name?: string;
    url?: string;
    email?: string;
    orderId?: string;
    orderDate?: Date;
    total?: number;
    otpCode?: string;
    newPassword?: string;
    createDate?: string;
    items?: any[];
}

export interface IMailOptions {
    to: string;
    subject: string;
    template: string;
    context: IMailContext;
}

export interface IMailService {
    sendOtpCode(user: UserProfile, otpCode: string): Promise<void>;
    sendNewPassword(user: UserProfile, newPassword: string): Promise<void>;
    sendOrderConfirmation(user: UserProfile, order: any): Promise<void>;
}

export interface IMailQueueService {
    addToQueue(type: string, data: any, options?: any): Promise<void>;
}
