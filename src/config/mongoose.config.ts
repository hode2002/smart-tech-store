import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';

export const mongooseConfig: MongooseModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL', 'mongodb://localhost:27017/smart-tech-store'),
    }),
    inject: [ConfigService],
};
