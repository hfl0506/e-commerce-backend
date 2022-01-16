export class CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export class VerifyUserDto {
  verifyCode: string;
}

export class ResetUserPasswordDto {
  id: string;
  resetCode: string;
  newPassword: string;
  confirmPassword: string;
}
