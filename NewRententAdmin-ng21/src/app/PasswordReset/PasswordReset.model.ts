// @ts-nocheck
export class PasswordReset {
  userID: number;
  userPasswordHistoryID: number;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;

  constructor(PasswordReset) {
    {
      this.userID = PasswordReset.userID || -1;
      this.userPasswordHistoryID = PasswordReset.userPasswordHistoryID || -1;
      this.email = PasswordReset.email || '';
      this.currentPassword = PasswordReset.password || '';
      this.newPassword = PasswordReset.newPassword || '';
      this.confirmNewPassword = PasswordReset.newPassword || '';
    }
  }
}

