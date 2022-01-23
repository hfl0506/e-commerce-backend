import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserEntity, UserSchema } from './user.entity';
import { UserService } from './user.service';
import { EmailModule } from '../email/email.module';
import { JwtStrategy } from 'src/strategy/jwt.startegy';
import { UtilsModule } from 'src/utils/utils.module';
import * as argon2 from 'argon2';
import { NextFunction } from 'express-serve-static-core';
import { JwtRtStrategy } from 'src/strategy/jwt-rt.startegy';
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: UserEntity.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre<UserEntity>('save', async function (next: NextFunction) {
            const user = this;
            console.log(user.password);
            const hash = await argon2.hash(user.password);
            user.password = hash;
            next();
          });

          return schema;
        },
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
