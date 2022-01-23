import {
  BadGatewayException,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LeanDocument, Model, Types } from 'mongoose';
import { nanoid } from 'nanoid';
import { EmailService } from '../email/email.service';
import {
  CreateUserDto,
  LoginDto,
  refreshTokenDto,
  ResetUserPasswordDto,
  VerifyUserDto,
} from './user.dto';
import { UserEntity } from './user.entity';
import { Response } from 'express';
import { JwtUtilsService } from 'src/utils/jwt.utils';
import * as argon2 from 'argon2';
import { RolesEnum } from './user.enum';
import { Tokens } from 'src/global/types/types.global';
import { privateFields } from 'src/global/omit.json';
import { omit } from 'lodash';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectModel(UserEntity.name) private userModel: Model<UserEntity>,
    private readonly emailService: EmailService,
    private readonly jwtUtils: JwtUtilsService,
  ) {}
  public async findUserById(id: Types.ObjectId): Promise<any> {
    try {
      return await this.userModel.findById(id).exec();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  public async getCurrentUser(res: Response): Promise<any> {
    try {
      return res.locals.user;
    } catch (error) {
      this.logger.error(error);
      throw new BadGatewayException(error);
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

  public async registerUser(dto: CreateUserDto): Promise<Tokens> {
    try {
      let payload = {
        ...dto,
        roles: RolesEnum.USER,
      };
      const user = new this.userModel(payload);
      if (!user) throw new Error('Could not create user');
      await user.save();
      await this.emailService.sendRegisterMail(user, 'register');
      const tokens = await this.jwtUtils.getTokens(
        user._id,
        user.email,
        user.roles,
        user.verified,
      );
      await this.updateUserRefreshToken(user._id, tokens.refresh_token);
      return tokens;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }

  public async loginLocal(dto: LoginDto): Promise<Tokens> {
    try {
      const user = await this.userModel.findOne({ email: dto.email });
      if (!user) throw new ForbiddenException('User not found');
      const isMatch = await argon2.verify(user.password, dto.password);
      if (!isMatch) throw new ForbiddenException('Access Denied');
      const tokens = await this.jwtUtils.getTokens(
        user._id,
        user.email,
        user.roles,
        user.verified,
      );
      await this.updateUserRefreshToken(user._id, tokens.refresh_token);
      return tokens;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  public async logout(userId: string): Promise<boolean> {
    try {
      const user = await this.userModel
        .findByIdAndUpdate(
          new Types.ObjectId(userId),
          { refreshToken: null },
          { new: true },
        )
        .exec();
      if (!user) throw new ForbiddenException('User Not Found');
      return true;
    } catch (error) {
      throw new ForbiddenException(error);
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

  public async updateUserRefreshToken(
    userId: Types.ObjectId,
    rt: string,
  ): Promise<void> {
    const hash = await argon2.hash(rt);
    await this.userModel
      .findByIdAndUpdate(userId, { refreshToken: hash }, { new: true })
      .exec();
  }

  public async refreshToken(
    userId: string,
    dto: refreshTokenDto,
  ): Promise<Tokens> {
    try {
      const user = await this.userModel
        .findById(new Types.ObjectId(userId))
        .exec();
      if (!user || !user.refreshToken)
        throw new ForbiddenException('Access Denied');
      console.log(dto.rt);
      const isRtMatch = await argon2.verify(user.refreshToken, dto.rt);
      if (!isRtMatch) throw new ForbiddenException('Access Denied');
      const tokens = await this.jwtUtils.getTokens(
        user._id,
        user.email,
        user.roles,
        user.verified,
      );
      await this.updateUserRefreshToken(user._id, tokens.refresh_token);
      return tokens;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
