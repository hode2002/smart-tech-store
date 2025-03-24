export interface IUserPasswordHandler {
    hashPassword(password: string): Promise<string>;
    comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean>;
    generateRandomPassword(): string;
}
