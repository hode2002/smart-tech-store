import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class CommonService {
    checkNotFound<T>(data: T, message?: string) {
        if (!data) {
            throw new NotFoundException(message || 'Not found');
        }
        return data;
    }
}
