import { InternalServerErrorException } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LeanDocument, Model, Types } from 'mongoose';
import { nanoid } from 'nanoid';
import { cwd } from 'process';
import { EmailService } from '../email/email.service';
import { CreateUserDto, ResetUserPasswordDto, VerifyUserDto } from './user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectModel(UserEntity.name) private userModel: Model<UserEntity>,
    private readonly emailService: EmailService,
  ) {}
  public async findUserById(id: Types.ObjectId): Promise<any> {
    try {
      return await this.userModel.findById(id).exec();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  public async findUserByEmail(email: string): Promise<any> {
    try {
      return await this.userModel.findOne({ email }).exec();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  public async registerUser(
    dto: CreateUserDto,
  ): Promise<LeanDocument<UserEntity>> {
    try {
      const user = new this.userModel(dto);
      if (!user) throw new Error('Could not create user');
      await this.emailService.sendRegisterMail(user, 'register');
      return await user.save().then((res) => res.toObject());
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err);
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
        await this.emailService.sendVerifiedMail(user, 'verified');
      }
      return new Error('Could not verify user');
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  public async userForgotPassword(email: string): Promise<any> {
    try {
      const user = await this.findUserByEmail(email);
      if (!user) throw new Error('Could not find email');
      if (!user.verified) return new Error('User is not verified');
      const passwordResetCode = nanoid();
      user.passwordResetCode = passwordResetCode;
      await this.emailService.sendForgetPasswordMail(user, 'forgetpassword');
      return await user
        .save()
        .then(() => 'Password reset code has been sent to specified email');
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err);
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
      await this.emailService.sendResetPasswordMail(user, 'password');
      return await user.save().then(() => 'Successfully to reset password');
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }
}
