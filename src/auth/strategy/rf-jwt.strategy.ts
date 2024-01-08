import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from 'src/common/types';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RfJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        configService: ConfigService,
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('REFRESH_TOKEN_SECRET'),
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: JwtPayload) {
        const refreshToken = <string>(
            req.get('Authorization').replace('Bearer', '').trim()
        );
        if (!refreshToken) throw new BadRequestException('Access denied');

        const { userId } = payload;

        const user = await this.userService.findById(userId);
        if (!user.refresh_token) throw new BadRequestException('Access denied');

        const isMatch = await bcrypt.compare(refreshToken, user.refresh_token);
        if (!isMatch) throw new BadRequestException('Access denied');

        return payload;
    }
}
