import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseDatabaseConfig } from '../config/mongoose.config';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import { CoreModule } from './core/core.module';
import { UtilsModule } from 'src/utils/utils.module';
import { ProductsModule } from './products/products.module';
import { BlogModule } from './blog/blog.module';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseDatabaseConfig,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CoreModule,
    EmailModule,
    UserModule,
    UtilsModule,
    ProductsModule,
    BlogModule,
  ],
})
export class AppModule {}
