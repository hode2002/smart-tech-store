import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { RESPONSE_MESSAGE_KEY } from 'src/common/decorators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
    constructor(private readonly reflector: Reflector) { }

    intercept(
        context: ExecutionContext,
        next: CallHandler<T>,
    ): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();

        const customMessage = this.reflector.get<string>(
            RESPONSE_MESSAGE_KEY,
            context.getHandler(),
        );

        return next.handle().pipe(
            map((data) => ({
                statusCode: res.statusCode,
                status: 'success',
                message: customMessage || `${req.method} ${req.url} successful`,
                data,
            })),
        );
    }
}
