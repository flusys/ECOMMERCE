import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Reflector } from '@nestjs/core';
import { PASSPORT_USER_TOKEN_TYPE } from '../../core/static-variable';

@Injectable()
export class JwtAuthGuard extends AuthGuard(PASSPORT_USER_TOKEN_TYPE) {
    constructor(private reflector: Reflector) {
        super();
    }
    
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        if (err || !user) {
            throw err || new UnauthorizedException('Sorry! User Not Found');
        }
        return user;
    }
}
