import { ForbiddenException, RequestMethod } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import * as compression from 'compression';
import helmet from 'helmet';

import { HttpExceptionFilter } from 'src/common/filters';
import { TransformInterceptor } from 'src/common/interceptors';

import { AppModule } from './app.module';
import { ValidationConfig } from './configs/validation.config';

const allowedOrigins = process.env.ALLOWED_ORIGINS;

const corsOptions: CorsOptions = {
    origin: (origin: string, callback: (error: ForbiddenException, isAllow?: boolean) => void) => {
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

    app.use(
        helmet({
            crossOriginResourcePolicy: {
                policy: 'cross-origin',
            },
        }),
    );
    app.use(compression());

    ValidationConfig(app);

    app.useGlobalInterceptors(new TransformInterceptor(new Reflector()));
    app.useGlobalFilters(new HttpExceptionFilter());
    app.setGlobalPrefix('/api/v1', {
        exclude: [
            { path: '/', method: RequestMethod.GET },
            { path: 'health', method: RequestMethod.GET },
        ],
    });

    const configService = app.get(ConfigService);
    const port = configService.get('PORT');

    await app.listen(port);
}
bootstrap();
