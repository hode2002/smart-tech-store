import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import { ForbiddenException } from '@nestjs/common';
import { ValidationConfig } from './configs/validation.config';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const allowedOrigins = process.env.ALLOWED_ORIGINS;

const corsOptions: CorsOptions = {
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
    credentials: true,
};

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors(corsOptions);

    // app.use(helmet());
    app.use(
        helmet({
            crossOriginResourcePolicy: false,
        }),
    );
    app.use(compression());

    ValidationConfig(app);

    const configService = app.get(ConfigService);
    const port = configService.get('PORT');

    await app.listen(port);
}
bootstrap();
