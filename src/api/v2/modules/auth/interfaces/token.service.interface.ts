import { CookieOptions, Request, Response } from 'express';

import {
    CreateTokenPayload,
    JwtPayload,
    LoginResult,
    RefreshToken,
    TokenPairs,
} from '@v2/modules/auth/types';

export interface ITokenService {
    verifyToken(token: string): JwtPayload;
    getTokenExpires(exp: number): number;
    createTokenPairs(payload: CreateTokenPayload): TokenPairs;
    setTokenToCookie(res: Response, token: RefreshToken, options: CookieOptions): void;
    refreshToken(req: Request, res: Response): Promise<LoginResult>;
    setTokenToBlacklist(sub: string, jti: string, expiresIn: number): Promise<void>;
    isTokenBlacklisted(sub: string, jti: string): Promise<boolean>;
}
