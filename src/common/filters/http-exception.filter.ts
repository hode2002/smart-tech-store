import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

const customMessage = (exception: any) => {
    let status = 'error';
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';

    if (exception instanceof HttpException) {
        statusCode = exception.getStatus();
        message = exception['response']?.message;
    } else {
        message = exception.message;
        status = exception?.code;
    }
    return { statusCode, status, message };
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const { statusCode, status, message } = customMessage(exception);

        response.status(statusCode).json({
            statusCode,
            status,
            message,
            path: request.url,
        });
    }
}
