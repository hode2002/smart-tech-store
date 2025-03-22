import { Injectable } from '@nestjs/common';

import { CacheService } from '@v2/modules/cache/cache.service';
import { IOtpRepository } from '@v2/modules/otp/interfaces';

@Injectable()
export class OtpRepository implements IOtpRepository {
    constructor(private readonly cacheService: CacheService) {}

    async store(email: string, otp: string): Promise<void> {
        await this.cacheService.set(`otp:${email}`, otp);
    }

    async validate(email: string, otp: string): Promise<boolean> {
        const storedOtp = await this.cacheService.get<string>(`otp:${email}`);
        return storedOtp === otp;
    }

    async delete(email: string): Promise<void> {
        await this.cacheService.del(`otp:${email}`);
    }
}
