import { ConfigService } from '@nestjs/config';

export const redisConfig = (configService: ConfigService) => ({
    host: configService.get<string>('REDIS_HOST', 'localhost'),
    port: configService.get<number>('REDIS_PORT', 6379),
});
