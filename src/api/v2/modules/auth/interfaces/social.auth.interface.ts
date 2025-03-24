import { Request, Response } from 'express';

export interface ISocialAuthService {
    googleLogin(req: Request, res: Response): Promise<void>;
    facebookLogin(req: Request, res: Response): Promise<void>;
}
