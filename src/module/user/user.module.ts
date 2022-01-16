import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserEntity, UserSchema } from './user.entity';
import { UserService } from './user.service';
import * as argon2 from 'argon2';
import { NextFunction } from 'express-serve-static-core';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: UserEntity.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre<UserEntity>('save', async function (next: NextFunction) {
            const user = this;
            if (!user.isModified('password')) return;
            const hash = await argon2.hash(user.password);
            user.password = hash;
            next();
          });

          schema.methods.validatePassword = async function validatePassword(
            candidatePassword: string,
          ) {
            return await argon2.verify(this.password, candidatePassword);
          };

          return schema;
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
