import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

@Injectable()
export class MongooseDatabaseConfig implements MongooseOptionsFactory {
  private readonly logger = new Logger(MongooseDatabaseConfig.name);
  constructor(private readonly configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.configService.get<string>('MONGO_URL'),
      connectionFactory: (connection) => {
        this.logger.log('connected db');
        return connection;
      },
    };
  }
}
