import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { ThirdPartyLoginDto } from '@/api/v1/modules/auth/dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: process.env.GOOGLE_APP_ID,
            clientSecret: process.env.GOOGLE_APP_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            scope: 'email',
            profileFields: ['emails', 'photos'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const { emails, photos } = profile;
        const user = <ThirdPartyLoginDto>{
            email: emails[0].value,
            avatar: photos[0].value,
        };
        done(null, user);
    }
}
