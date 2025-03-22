export interface IOtpRepository {
    store(email: string, otp: string): Promise<void>;
    validate(email: string, otp: string): Promise<boolean>;
    delete(email: string): Promise<void>;
}
