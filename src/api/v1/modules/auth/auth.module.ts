import { BullModule } from '@nestjs/bull';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { TurnstileMiddleware } from '@/common/middlewares';
import { PrismaModule } from '@/prisma/prisma.module';
import { UserModule } from '@v1/modules/user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Otp, OtpSchema } from './model/schema.model';
import { AtJwtStrategy, FacebookStrategy, GoogleStrategy, RfJwtStrategy } from './strategy';

@Module({
    imports: [
        PrismaModule,
        PassportModule,
        JwtModule.register({}),
        UserModule,
        BullModule.registerQueue({
            name: 'send-mail',
        }),
        MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
    ],
    controllers: [AuthController],
    providers: [AuthService, AtJwtStrategy, RfJwtStrategy, FacebookStrategy, GoogleStrategy],
    exports: [AuthService],
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(TurnstileMiddleware)
            .forRoutes('auth/login', 'auth/register', 'auth/forgot-password');
    }
}
