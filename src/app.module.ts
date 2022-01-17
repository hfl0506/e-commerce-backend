import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseDatabaseConfig } from './config/mongoose.config';
import { UserModule } from './module/user/user.module';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailModule } from './module/email/email.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseDatabaseConfig,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EmailModule,
    UserModule,
  ],
})
export class AppModule {}
