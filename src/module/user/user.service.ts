import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectModel(UserEntity.name) private userModel: Model<UserEntity>,
  ) {}

  public async registerUser(dto: CreateUserDto): Promise<any> {
    try {
      const user = new this.userModel(dto);
      if (user) this.logger.log(user);
      return await user.save().then((res) => res.toObject());
    } catch (err) {
      this.logger.error(err);
    }
  }
}
