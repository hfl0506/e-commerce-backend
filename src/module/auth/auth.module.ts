import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from 'src/utils/jwt.utils';
import { ValidateService } from 'src/utils/validate.utils';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthEntity, AuthSchema } from './auth.entity';
import { AuthService } from './auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AuthEntity.name,
        schema: AuthSchema,
      },
    ]),
    UserModule,
  ],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, ValidateService, JwtService],
})
export class AuthModule {}
