import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { TurnstileMiddleware } from '@/common/middlewares';
import { AuthController } from '@v2/modules/auth/auth.controller';
import { AuthService } from '@v2/modules/auth/services/auth.service';
import { SocialAuthService } from '@v2/modules/auth/services/social.auth.service';
import { TokenService } from '@v2/modules/auth/services/token.service';
import {
    AtJwtStrategy,
    FacebookStrategy,
    GoogleStrategy,
    RfJwtStrategy,
} from '@v2/modules/auth/strategy';
import { CommonModule } from '@v2/modules/common/common.module';
import { MAIL_SERVICE } from '@v2/modules/mail/constants';
import { MailModule } from '@v2/modules/mail/mail.module';
import { MailService } from '@v2/modules/mail/services/mail.service';
import { OtpModule } from '@v2/modules/otp/otp.module';
import { UserModule } from '@v2/modules/user/user.module';

@Module({
    imports: [
        CommonModule,
        PassportModule,
        JwtModule.register({}),
        UserModule,
        OtpModule,
        MailModule,
    ],
    controllers: [AuthController],
    providers: [
        TokenService,
        {
            provide: MAIL_SERVICE,
            useClass: MailService,
        },
        AuthService,
        SocialAuthService,
        AtJwtStrategy,
        RfJwtStrategy,
        FacebookStrategy,
        GoogleStrategy,
    ],
    exports: [AuthService],
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(TurnstileMiddleware)
            .forRoutes('auth/login', 'auth/register', 'auth/forgot-password');
    }
}
