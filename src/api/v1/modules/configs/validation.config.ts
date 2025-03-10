import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export const ValidationConfig = (app: INestApplication) => {
    app.useGlobalPipes(
        new ValidationPipe({
            stopAtFirstError: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            forbidUnknownValues: true,
            exceptionFactory: (validationErrors: ValidationError[]) => {
                const errors = validationErrors.map(error => ({
                    [error.property]: Object.values(error.constraints)[0],
                }));
                return new BadRequestException(errors);
            },
        }),
    );
};
