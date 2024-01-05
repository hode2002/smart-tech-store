import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetEmail = createParamDecorator(
    (data: undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request?.user.email;
    },
);
