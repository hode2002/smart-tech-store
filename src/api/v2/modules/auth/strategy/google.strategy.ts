import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { GoogleProfile } from '@v2/modules/auth/types';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: process.env.GOOGLE_APP_ID,
            clientSecret: process.env.GOOGLE_APP_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            scope: ['profile', 'email'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const { displayName, emails, photos } = profile;
        const user: GoogleProfile = {
            email: emails?.[0]?.value,
            name: displayName,
            avatar: photos?.[0]?.value,
        };

        return done(null, user);
    }
}
