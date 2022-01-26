import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserEntity, UserSchema } from './user.entity';
import { UserService } from './user.service';
import { EmailModule } from '../email/email.module';
import { JwtStrategy } from 'src/strategy/jwt.startegy';
import { UtilsModule } from 'src/utils/utils.module';
import * as argon2 from 'argon2';
import { JwtRtStrategy } from 'src/strategy/jwt-rt.startegy';
import { NextFunction } from 'express';
import { CallbackError, PreSaveMiddlewareFunction } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserEntity.name,
        schema: UserSchema,
      },
    ]),
    EmailModule,
    UtilsModule,
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, JwtRtStrategy],
  exports: [UserService],
})
export class UserModule {}
