import { ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions, Request, Response } from 'express';
import Keyv from 'keyv';
import { v4 as uuidv4 } from 'uuid';

import { ITokenService } from '@v2/modules/auth/interfaces';
import { AccessToken, CreateTokenPayload, JwtPayload, RefreshToken } from '@v2/modules/auth/types';
import { KEYV_REDIS } from '@v2/modules/redis/constants';

@Injectable()
export class TokenService implements ITokenService {
    constructor(
        @Inject(KEYV_REDIS)
        private readonly redis: Keyv,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {}

    verifyToken(token: string): JwtPayload {
        try {
            const payload = this.jwtService.verify(token, {
                secret: this.configService.get('REFRESH_TOKEN_SECRET'),
            });

            return payload;
        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token expired');
            } else if (error.name === 'JsonWebTokenError') {
                throw new UnauthorizedException('Invalid token');
            }
            throw new ForbiddenException('Access denied');
        }
    }

    decodedToken(token: AccessToken | RefreshToken) {
        const decoded: JwtPayload = this.jwtService.decode(token);
        if (!decoded?.sub || !decoded?.jti) {
            throw new UnauthorizedException('Invalid token');
        }
        return decoded;
    }

    getTokenExpires(exp: number) {
        return exp - Math.floor(Date.now() / 1000);
    }

    createTokenPairs(payload: CreateTokenPayload) {
        const accessToken = this.jwtService.sign(
            { ...payload, jti: uuidv4() },
            {
                secret: this.configService.get('ACCESS_TOKEN_SECRET'),
                expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES_IN'),
            },
        );

        const refreshToken = this.jwtService.sign(
            { ...payload, jti: uuidv4() },
            {
                secret: this.configService.get('REFRESH_TOKEN_SECRET'),
                expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
            },
        );

        return { accessToken, refreshToken };
    }

    setTokenToCookie(res: Response, token: RefreshToken, options?: CookieOptions) {
        const defaultOptions = this.configService.get('COOKIE_OPTIONS');
        res.cookie('refreshToken', token, { ...defaultOptions, ...options });
    }

    async setTokenToBlacklist(token: AccessToken | RefreshToken) {
        const decoded = this.decodedToken(token);
        const expiresIn = this.getTokenExpires(decoded.exp);

        await this.redis.set(
            `BLACK_LIST_${decoded.sub}_${decoded.jti}`,
            'revoked',
            expiresIn * 1000,
        );
    }

    async isTokenBlacklisted(sub: string, jti: string) {
        return !!(await this.redis.get(`BLACK_LIST_${sub}_${jti}`));
    }

    async refreshToken(req: Request, res: Response) {
        const token = req.cookies.refreshToken;
        const decoded = this.decodedToken(token);

        const isRevoked = await this.isTokenBlacklisted(decoded.sub, decoded.jti);
        if (isRevoked) {
            throw new UnauthorizedException('Token revoked');
        }

        await this.setTokenToBlacklist(token);
        const payload = this.verifyToken(token);

        const { accessToken, refreshToken } = this.createTokenPairs({
            sub: payload.sub,
            role: payload.role,
        });

        this.setTokenToCookie(res, refreshToken);
        return { accessToken };
    }
}
