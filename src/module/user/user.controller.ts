import { Body, Controller, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  public async RegisterUserHandler(@Body() dto: CreateUserDto): Promise<any> {
    return this.userService.registerUser(dto);
  }
}
