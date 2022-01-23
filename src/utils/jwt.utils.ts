import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { PrivateKeyEnum } from 'src/enum/key.enum';
import { JwtPayload, Tokens } from 'src/global/types/types.global';

@Injectable()
export class JwtUtilsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public async getTokens(
    userId: string,
    userEmail: string,
    userRole: string,
    status: boolean,
  ): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: userEmail,
      role: userRole,
      verify: status.toString(),
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>(PrivateKeyEnum.ACCESS_PRI_TOEKN),
        expiresIn: this.configService.get<string>('MINS'),
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>(
          PrivateKeyEnum.REFRESH_PRI_TOKEN,
        ),
        expiresIn: this.configService.get<string>('YEAR'),
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
