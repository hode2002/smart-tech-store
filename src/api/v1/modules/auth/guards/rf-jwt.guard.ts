import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RfJwtGuard extends AuthGuard('jwt-refresh') {}
