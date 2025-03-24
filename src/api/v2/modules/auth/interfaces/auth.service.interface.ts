import { Request, Response } from 'express';

import { UserProfile } from '@/prisma/selectors';
import { LoginResult } from '@v2/modules/auth/types';

export interface IAuthService {
    verifyEmail(email: string): Promise<void>;
    validateUser(email: string, password: string): Promise<UserProfile>;
    register(email: string): Promise<boolean>;
    activeEmail(email: string, otpCode: string): Promise<boolean>;
    createPassword(email: string, password: string): Promise<boolean>;
    login(res: Response, email: string, password: string): Promise<LoginResult>;
    logout(req: Request, res: Response): Promise<boolean>;
    forgotPassword(email: string): Promise<boolean>;
}
