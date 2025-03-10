import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

export class GoogleGuard extends AuthGuard('google') {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any) {
        if (err || !user) {
            return this.getRequest;
        }
        return user;
    }

    getRequest(context: ExecutionContext) {
        return context.switchToHttp().getRequest();
    }
}
