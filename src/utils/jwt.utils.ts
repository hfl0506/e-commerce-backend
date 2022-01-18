import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';
import { PrivateKeyEnum, PublicKeyEnum } from 'src/enum/key.enum';

@Injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {}

  public signJwt(
    object: Object,
    keyName: PrivateKeyEnum,
    options?: jwt.SignOptions | undefined,
  ) {
    const signKey = Buffer.from(
      this.configService.get<string>(keyName),
      'base64',
    ).toString('ascii');
    try {
      return jwt.sign(object, signKey, {
        ...(options && options),
        algorithm: 'RS256',
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public verifyJwt<T>(token: string, keyName: PublicKeyEnum): T | null {
    const publicKey = Buffer.from(
      this.configService.get<string>(keyName),
      'base64',
    ).toString('ascii');
    try {
      const decoded = jwt.verify(token, publicKey) as T;
      return decoded;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
