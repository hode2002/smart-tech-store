import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class TurnstileMiddleware implements NestMiddleware {
    constructor(private configService: ConfigService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const token = req.body.turnstileToken;
        if (!token) {
            throw new BadRequestException('Missing Turnstile token');
        }

        const secretKey = this.configService.get('TURNSTILE_SECRET_KEY');
        const verifyUrl = this.configService.get('TURNSTILE_VERIFY_URL');

        const { data } = await axios.post(
            verifyUrl,
            new URLSearchParams({
                secret: secretKey,
                response: token,
                remoteip: req.ip,
            }),
        );

        if (!data.success) {
            throw new BadRequestException('Turnstile verification failed');
        }

        next();
    }
}
