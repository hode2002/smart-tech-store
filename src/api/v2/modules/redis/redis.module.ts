import KeyvRedis from '@keyv/redis';
import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Keyv from 'keyv';

import { KEYV_REDIS } from '@v2/modules/redis/constants';

@Global()
@Module({
    providers: [
        {
            provide: KEYV_REDIS,
            useFactory: (configService: ConfigService): Keyv<any> => {
                return new Keyv(
                    {
                        store: new KeyvRedis(configService.get<string>('REDIS_URL')),
                    },
                    { namespace: '' },
                );
            },
            inject: [ConfigService],
        },
    ],
    exports: [KEYV_REDIS],
})
export class RedisModule {}
