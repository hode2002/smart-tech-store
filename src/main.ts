import { ForbiddenException, RequestMethod } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { HttpExceptionFilter } from '@/common/filters';
import { TransformInterceptor } from '@/common/interceptors';
import { ValidationConfig } from '@v1/modules/configs/validation.config';

import { AppModule } from './app.module';

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

    app.use(helmet());
    app.use(compression());
    app.use(cookieParser());

    ValidationConfig(app);

    app.useGlobalInterceptors(new TransformInterceptor(new Reflector()));
    app.useGlobalFilters(new HttpExceptionFilter());
    app.setGlobalPrefix('/api/v2', {
        exclude: [
            { path: '/', method: RequestMethod.GET },
            { path: 'health', method: RequestMethod.GET },
        ],
    });

    const config = new DocumentBuilder()
        .setTitle('Smart Tech API')
        .setDescription('API Documentation')
        .setVersion('2.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                in: 'header',
            },
            'access-token',
        )
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/', app, document);

    const configService = app.get(ConfigService);
    const port = configService.get('PORT', 3001);

    await app.listen(port);
}
bootstrap();
