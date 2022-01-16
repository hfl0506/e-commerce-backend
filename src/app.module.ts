import { Module } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseDatabaseConfig } from './config/mongoose.config';
import { UserModule } from './module/user/user.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseDatabaseConfig,
    }),
  ],
})
export class AppModule {}
