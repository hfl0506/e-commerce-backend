import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UserEntity } from 'src/module/user/user.entity';
import argon2 from 'argon2';

@Injectable()
export class ValidateService {
  private readonly logger = new Logger(ValidateService.name);
  constructor() {}

  public async validatePassword(user: UserEntity, candidatePassword: string) {
    try {
      return await argon2.verify(user.password, candidatePassword);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
