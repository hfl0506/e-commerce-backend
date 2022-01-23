import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/module/user/user.service';
import { JwtPayload } from 'src/global/types/types.global';
import { PrivateKeyEnum } from 'src/enum/key.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>(PrivateKeyEnum.ACCESS_PRI_TOKEN),
    });
  }

  validate(payload: any) {
    return payload;
  }
}
