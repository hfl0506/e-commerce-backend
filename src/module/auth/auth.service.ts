import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from 'src/utils/jwt.utils';
import { ValidateService } from 'src/utils/validate.utils';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthIncomingDto } from './auth.dto';
import { omit } from 'lodash';
import { PrivateKeyEnum } from 'src/enum/key.enum';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { AuthEntity } from './auth.entity';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly validateService: ValidateService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(AuthEntity.name) private authModel: Model<AuthEntity>,
  ) {}

  public async createAuthHandler(dto: AuthIncomingDto): Promise<any> {
    try {
      const message = 'Invalid Email or Password';

      const user = await this.userService.findUserByEmail(dto.email);

      if (!user) throw new Error(message);

      if (!user.verified) throw new Error(message);

      const isValid = await this.validateService.validatePassword(
        user,
        dto.password,
      );

      if (!isValid) throw new Error(message);

      const accessToken = this.signAccessToken(user);

      const refreshToken = await this.signRefreshToken({ userId: user._id });

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  public async refreshAccessTokenHandler(): Promise<any> {
    return;
  }

  public async createSession({ userId }: { userId: string }) {
    return this.authModel.create({ user: userId });
  }

  public async findSessionById(id: string) {
    return this.authModel.findById(id);
  }

  public async signAccessToken(user: UserEntity) {
    const privateFields = [
      'password',
      '__v',
      'verficationCode',
      'passwordResetCode',
      'verified',
    ];
    const payload = omit(user.toJSON(), privateFields);

    const accessToken = this.jwtService.signJwt(
      payload,
      PrivateKeyEnum.ACCESS_PRI_TOEKN,
      {
        expiresIn: this.configService.get<string>('MINS'),
      },
    );
    return accessToken;
  }

  public async signRefreshToken({ userId }: { userId: string }) {
    const session = await this.createSession({ userId });

    const refreshToken = this.jwtService.signJwt(
      {
        session: session._id,
      },
      PrivateKeyEnum.REFRESH_PRI_TOKEN,
      {
        expiresIn: this.configService.get<string>('YEAR'),
      },
    );
    return refreshToken;
  }
}
