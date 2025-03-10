import { Controller, Get } from '@nestjs/common';
import {
    HealthCheck,
    HealthCheckService,
    HttpHealthIndicator,
    MongooseHealthIndicator,
    PrismaHealthIndicator,
} from '@nestjs/terminus';

import { ResponseMessage } from 'src/common/decorators/message.decorator';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
        private mongo: MongooseHealthIndicator,
        private prismaHealthIndicator: PrismaHealthIndicator,
        private prismaService: PrismaService,
    ) {}

    @Get()
    @HealthCheck()
    @ResponseMessage('Health check is successful')
    check() {
        return this.health.check([
            () => this.http.pingCheck('google', 'https://www.google.com'),
            () => this.mongo.pingCheck('mongodb'),
            () => this.prismaHealthIndicator.pingCheck('database', this.prismaService),
        ]);
    }
}
