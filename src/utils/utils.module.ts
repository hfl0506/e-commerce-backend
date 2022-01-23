import { Module } from '@nestjs/common';
import { JwtUtilsService } from './jwt.utils';

@Module({
  providers: [JwtUtilsService],
  exports: [JwtUtilsService],
})
export class UtilsModule {}
