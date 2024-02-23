import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AtJwtStrategy, RfJwtStrategy } from './strategy';
import { UserModule } from 'src/user/user.module';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OtpSchema } from './model/schema.model';
import { FacebookStrategy } from './strategy/facebook.stategy';
import { GoogleStrategy } from './strategy/google.strategy';

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
    providers: [
        AuthService,
        AtJwtStrategy,
        RfJwtStrategy,
        FacebookStrategy,
        GoogleStrategy,
    ],
    exports: [AuthService],
})
export class AuthModule {}
