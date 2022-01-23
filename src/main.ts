import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { RolesGuard } from './guard/roles.guard';
import { ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 3000;
  const reflector = app.get(Reflector);
  const jwtService = app.get<JwtService>(JwtService);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalGuards(
    new RolesGuard(reflector),
    new JwtAuthGuard(reflector, jwtService),
  );
  await app.listen(port, () => {
    console.info(`Server is running at port ${port}`);
  });
}
bootstrap();
