import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TokenService } from '@v2/modules/auth/services';
import { JwtPayload } from '@v2/modules/auth/types';

@Injectable()
export class AtJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        configService: ConfigService,
        private readonly tokenService: TokenService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('ACCESS_TOKEN_SECRET'),
        });
    }

    async validate(payload: JwtPayload) {
        const isRevoked = await this.tokenService.isTokenBlacklisted(payload.sub, payload.jti);
        if (isRevoked) {
            throw new UnauthorizedException('Token revoked');
        }
        return payload;
    }
}
