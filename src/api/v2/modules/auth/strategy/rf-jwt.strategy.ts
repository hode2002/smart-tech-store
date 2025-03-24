import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '@v2/modules/auth/types';

@Injectable()
export class RfJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                    if (req.cookies && req.cookies['refreshToken']) {
                        return req.cookies['refreshToken'];
                    }
                    return null;
                },
            ]),
            secretOrKey: configService.get('REFRESH_TOKEN_SECRET'),
        });
    }

    async validate(payload: JwtPayload) {
        return payload;
    }
}
