import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as passwordGenerator from 'generate-password';

import { USER_SERVICE_CONSTANTS } from '@v2/modules/user/constants';
import { IUserPasswordHandler } from '@v2/modules/user/interfaces';

@Injectable()
export class PasswordHandler implements IUserPasswordHandler {
    private readonly SALT_ROUNDS = USER_SERVICE_CONSTANTS.SALT_ROUNDS;

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, this.SALT_ROUNDS);
    }

    async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    generateRandomPassword(): string {
        const password = passwordGenerator.generate({
            length: USER_SERVICE_CONSTANTS.DEFAULT_PASSWORD_LENGTH,
            lowercase: true,
            uppercase: true,
            numbers: true,
            strict: true,
        });

        if (!password) {
            throw new InternalServerErrorException('Failed to generate password');
        }

        return password;
    }
}
