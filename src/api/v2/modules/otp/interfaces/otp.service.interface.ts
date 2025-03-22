import { User } from '@prisma/client';

export interface IOtpService {
    validateOtp(email: string, otp: string): Promise<boolean>;
    storeOtp(email: string, otp: string): Promise<void>;
    sendOtp(user: User): Promise<void>;
}
