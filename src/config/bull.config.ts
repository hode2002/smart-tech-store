import { BullModuleOptions } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { redisConfig } from '@/config/redis.config';

export const bullConfig = {
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService): Promise<BullModuleOptions> => ({
        redis: {
            enableTLSForSentinelMode: false,
            ...redisConfig(configService),
        },
    }),
    inject: [ConfigService],
};
