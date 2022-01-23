import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    {
      ...JwtModule.register({}),
      global: true,
    },
  ],
  exports: [JwtModule],
})
export class CoreModule {}
