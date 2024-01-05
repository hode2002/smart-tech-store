import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import { ForbiddenException } from '@nestjs/common';
import { ValidationConfig } from './configs/validation.config';

const allowedOrigins = ['http://localhost:3000'];

const corsOptions = {
    origin: (
        origin: string,
        callback: (error: ForbiddenException, isAllow?: boolean) => void,
    ) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new ForbiddenException('Origin not allowed by CORS'));
        }
    },
    methods: 'GET,POST,PUT,PATCH,DELETE',
};

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({ ...corsOptions });
    app.use(helmet());
    app.use(compression());

    ValidationConfig(app);

    const configService = app.get(ConfigService);
    const port = configService.get('PORT');

    await app.listen(port);
}
bootstrap();
