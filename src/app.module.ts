import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseDatabaseConfig } from './config/mongoose.config';
import { UserModule } from './module/user/user.module';
import { EmailModule } from './module/email/email.module';
import { AuthModule } from './module/auth/auth.module';

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
    AuthModule,
  ],
})
export class AppModule {}
