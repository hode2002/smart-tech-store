import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';

import { FacebookProfile } from '@v2/modules/auth/types';

export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor() {
        super({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL,
            scope: ['email'],
            profileFields: ['id', 'displayName', 'emails', 'photos'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (err: any, user: any, info?: any) => void,
    ) {
        const { displayName, emails, photos } = profile;
        const user: FacebookProfile = {
            email: emails?.[0]?.value,
            name: displayName,
            avatar: photos?.[0]?.value,
        };

        return done(null, user);
    }
}
