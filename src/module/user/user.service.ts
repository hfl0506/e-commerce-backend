import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { nanoid } from 'nanoid';
import { CreateUserDto, ResetUserPasswordDto, VerifyUserDto } from './user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectModel(UserEntity.name) private userModel: Model<UserEntity>,
  ) {}
  public async findUserById(id: Types.ObjectId): Promise<any> {
    try {
      return await this.userModel.findById(id).exec();
    } catch (err) {
      this.logger.error(err);
      return err;
    }
  }

  public async findUserByEmail(email: string): Promise<any> {
    try {
      return await this.userModel.findOne({ email }).exec();
    } catch (err) {
      this.logger.error(err);
      return err;
    }
  }

  public async registerUser(dto: CreateUserDto): Promise<any> {
    try {
      const user = new this.userModel(dto);
      if (user) this.logger.log(user);
      return await user.save().then((res) => res.toObject());
    } catch (err) {
      this.logger.error(err);
      return err;
    }
  }

  public async verifyUser(id: string, dto: VerifyUserDto): Promise<any> {
    try {
      const user = await this.findUserById(new Types.ObjectId(id));
      if (!user) throw new Error('Could not find user');
      if (user.verified) return;
      if (user.verificationCode === dto.verifyCode) {
        user.verified = true;
        await user.save().then(() => 'User is verified');
      }
      return new Error('Could not verify user');
    } catch (err) {
      this.logger.error(err);
      return err;
    }
  }

  public async userForgotPassword(email: string): Promise<any> {
    try {
      const user = await this.findUserByEmail(email);
      if (!user) throw new Error('Could not find email');
      if (!user.verified) return new Error('User is not verified');
      const passwordResetCode = nanoid();
      user.passwordResetCode = passwordResetCode;
      return await user
        .save()
        .then(() => 'Password reset code has been sent to specified email');
    } catch (err) {
      this.logger.error(err);
      return err;
    }
  }

  public async resetUserPassword(dto: ResetUserPasswordDto): Promise<any> {
    try {
      const user = await this.findUserById(new Types.ObjectId(dto.id));
      if (
        !user ||
        !user.passwordResetCode ||
        user.passwordResetCode !== dto.resetCode ||
        dto.newPassword !== dto.confirmPassword
      ) {
        throw new Error('Could not reset password');
      }
      user.passwordResetCode = null;
      user.password = dto.confirmPassword;
      return await user.save().then(() => 'Successfully to reset password');
    } catch (err) {
      this.logger.error(err);
      return err;
    }
  }
}
