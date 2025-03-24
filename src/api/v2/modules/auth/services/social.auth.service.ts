import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

import { ISocialAuthService } from '@v2/modules/auth/interfaces';
import { TokenService } from '@v2/modules/auth/services/token.service';
import { FacebookProfile, GoogleProfile } from '@v2/modules/auth/types';
import { USER_TOKENS } from '@v2/modules/user/constants';
import { IUserCommandService, IUserQueryService } from '@v2/modules/user/interfaces';

@Injectable()
export class SocialAuthService implements ISocialAuthService {
    constructor(
        @Inject(USER_TOKENS.SERVICES.USER_QUERY_SERVICE)
        private readonly userQueryService: IUserQueryService,
        @Inject(USER_TOKENS.SERVICES.USER_COMMAND_SERVICE)
        private readonly userCommandService: IUserCommandService,
        private readonly configService: ConfigService,
        private readonly tokenService: TokenService,
    ) {}

    async facebookLogin(req: Request, res: Response) {
        const { email, name, avatar } = req.user as FacebookProfile;

        if (!email) {
            throw new UnprocessableEntityException(
                'Something went wrong when trying to login to Facebook',
            );
        }

        let existingUser = await this.userQueryService.findByEmail(email);
        if (!existingUser) {
            existingUser = await this.userCommandService.create(
                {
                    email,
                    avatar,
                    name,
                },
                'FACEBOOK',
            );
        }

        const { accessToken, refreshToken } = this.tokenService.createTokenPairs({
            sub: existingUser.id,
            role: existingUser.role,
        });
        this.tokenService.setTokenToCookie(res, refreshToken);

        const redirectUrl = `${this.configService.get(
            'FRONTEND_REDIRECT_URL',
        )}/auth-success#token=${accessToken}`;

        return res.redirect(redirectUrl);
    }

    async googleLogin(req: Request, res: Response) {
        const { email, name, avatar } = req.user as GoogleProfile;

        let existingUser = await this.userQueryService.findByEmail(email);
        if (!existingUser) {
            existingUser = await this.userCommandService.create(
                {
                    email,
                    avatar,
                    name,
                },
                'GOOGLE',
            );
        }

        const { accessToken, refreshToken } = this.tokenService.createTokenPairs({
            sub: existingUser.id,
            role: existingUser.role,
        });
        this.tokenService.setTokenToCookie(res, refreshToken);

        const redirectUrl = `${this.configService.get(
            'FRONTEND_REDIRECT_URL',
        )}/auth-success#token=${accessToken}`;

        return res.redirect(redirectUrl);
    }
}
