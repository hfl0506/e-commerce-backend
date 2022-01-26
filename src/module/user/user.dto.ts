import { Tokens } from 'src/global/types/types.global';

export class CreateUserDto {
  email!: string;
  firstName!: string;
  lastName!: string;
  password!: string;
}

export class VerifyUserDto {
  verifyCode!: string;
}

export class ResetUserPasswordDto {
  id!: string;
  resetCode!: string;
  newPassword!: string;
  confirmPassword!: string;
}

export class LoginDto {
  email!: string;
  password!: string;
}

export class refreshTokenDto {
  rt!: string;
}
