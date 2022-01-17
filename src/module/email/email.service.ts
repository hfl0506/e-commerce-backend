import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  constructor(private readonly mailerService: MailerService) {}

  public async sendRegisterMail(user: UserEntity, template: string) {
    await this.mailerService
      .sendMail({
        to: user.email,
        subject: "Thank you for register, here's your verify code and id",
        template: `./${template}`,
        context: {
          name: `${user.firstName} ${user.lastName}`,
          id: user._id,
          code: user.verificationCode,
        },
      })
      .then(() =>
        this.logger.log(
          `register email has been sent to ${user.email} in ${new Date()}`,
        ),
      )
      .catch((err) => {
        throw new Error(err);
      });
  }
  public async sendVerifiedMail(user: UserEntity, template: string) {
    await this.mailerService
      .sendMail({
        to: user.email,
        subject: 'Thank you for verified your account',
        template: `./${template}`,
        context: {
          name: `${user.firstName} ${user.lastName}`,
        },
      })
      .then(() =>
        this.logger.log(
          `verified email has been sent to ${user.email} in ${new Date()}`,
        ),
      )
      .catch((err) => {
        throw new Error(err);
      });
  }

  public async sendForgetPasswordMail(user: UserEntity, template: string) {
    await this.mailerService
      .sendMail({
        to: user.email,
        subject: 'Credential Code for reset password',
        template: `./${template}`,
        context: {
          name: `${user.firstName} ${user.lastName}`,
          code: user.passwordResetCode,
          id: user._id,
        },
      })
      .then(() =>
        this.logger.log(
          `password reset code email has been sent to ${
            user.email
          } in ${new Date()}`,
        ),
      )
      .catch((err) => {
        throw new Error(err);
      });
  }

  public async sendResetPasswordMail(user: UserEntity, template: string) {
    await this.mailerService
      .sendMail({
        to: user.email,
        subject: 'Password has been reseted',
        template: `./${template}`,
        context: {
          name: `${user.firstName} ${user.lastName}`,
          id: user._id,
        },
      })
      .then(() =>
        this.logger.log(
          `password reset code email has been sent to ${
            user.email
          } in ${new Date()}`,
        ),
      )
      .catch((err) => {
        throw new Error(err);
      });
  }
}
