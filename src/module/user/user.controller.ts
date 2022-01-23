import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Types } from 'mongoose';
import {
  CreateUserDto,
  LoginDto,
  refreshTokenDto,
  ResetUserPasswordDto,
  VerifyUserDto,
} from './user.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { Public } from 'src/decorator/is-public.decorator';
import { CurrentUser } from 'src/decorator/current-user.decorator';
import { Tokens } from 'src/global/types/types.global';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  public async GetCurrentUser(@CurrentUser() user: any): Promise<any> {
    return user;
  }
  @Get(':id')
  public async GetUserById(@Param('id') id: string): Promise<UserEntity> {
    return await this.userService.findUserById(new Types.ObjectId(id));
  }

  @Public()
  @Post('')
  public async RegisterUserHandler(@Body() dto: CreateUserDto): Promise<any> {
    return await this.userService.registerUser(dto);
  }

  @Public()
  @Post('login')
  public async LoginLocal(@Body() dto: LoginDto): Promise<Tokens> {
    return await this.userService.loginLocal(dto);
  }

  @Post('logout')
  public async Logout(@CurrentUser() user: any): Promise<boolean> {
    return this.userService.logout(user.sub);
  }

  @Post('verify/:id')
  public async VerifyUserHandler(
    @Param('id') id: string,
    @Body() dto: VerifyUserDto,
  ): Promise<any> {
    return await this.userService.verifyUser(id, dto);
  }

  @Post('refresh')
  public async RefreshToken(
    @CurrentUser() user: any,
    @Body() dto: refreshTokenDto,
  ): Promise<Tokens> {
    return await this.userService.refreshToken(user.sub, dto);
  }

  @Public()
  @Post('forgetpassword')
  public async ForgetPasswordHandler(@Body() email: string): Promise<any> {
    return await this.userService.findUserByEmail(email);
  }

  @Public()
  @Post('resetpassword')
  public async ResetPasswordHandler(
    @Body() dto: ResetUserPasswordDto,
  ): Promise<any> {
    return await this.userService.resetUserPassword(dto);
  }
}
