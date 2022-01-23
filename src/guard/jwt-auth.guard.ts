import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { isJWT } from 'class-validator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector, private jwtService: JwtService) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();

    if (request?.headers?.authorization?.startsWith('Bearer ')) {
      const jwt = request.headers.authorization.replace('Bearer ', '');
      if (isJWT(jwt)) {
        request.user = this.jwtService.decode(jwt);
        return true;
      }
    }

    return super.canActivate(context);
  }
}
