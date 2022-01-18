import { Body, Controller, Post } from '@nestjs/common';
import { AuthIncomingDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  public async CreateAuthHandler(@Body() dto: AuthIncomingDto): Promise<any> {
    return this.authService.createAuthHandler(dto);
  }

  @Post('refresh')
  public async RefreshAccessTokenHandler(): Promise<any> {
    return this.authService.refreshAccessTokenHandler();
  }
}
