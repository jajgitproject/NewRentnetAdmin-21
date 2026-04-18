// @ts-nocheck
export class ForgotPassword {
  email: number;
  otp: number;
  newPassword: string;
  confirmNewPassword: string;

  constructor(ForgotPassword) {
    {
      this.email = ForgotPassword.email || '';
      this.otp = ForgotPassword.otp || '';
      this.newPassword = ForgotPassword.newPassword || '';
      this.confirmNewPassword = ForgotPassword.newPassword || '';
    }
  }
}

