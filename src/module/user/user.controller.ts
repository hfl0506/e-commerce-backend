import { Body, Controller, Param, Post } from '@nestjs/common';
import { CreateUserDto, ResetUserPasswordDto, VerifyUserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  public async RegisterUserHandler(@Body() dto: CreateUserDto): Promise<any> {
    return await this.userService.registerUser(dto);
  }

  @Post('verify/:id')
  public async VerifyUserHandler(
    @Param('id') id: string,
    @Body() dto: VerifyUserDto,
  ): Promise<any> {
    return await this.userService.verifyUser(id, dto);
  }

  @Post('forgetpassword')
  public async ForgetPasswordHandler(@Body() email: string): Promise<any> {
    return await this.userService.findUserByEmail(email);
  }

  @Post('resetpassword')
  public async ResetPasswordHandler(
    @Body() dto: ResetUserPasswordDto,
  ): Promise<any> {
    return await this.userService.resetUserPassword(dto);
  }
}
