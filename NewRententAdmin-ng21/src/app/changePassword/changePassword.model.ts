// @ts-nocheck
import { formatDate } from '@angular/common';
export class ChangePasswordModel {
   password: string;
   newPassword: string;
   confirmNewPassword: string;
   oldPassword: string;
   userID:number;
   email: string;

  constructor(changePasswordModel) {
    {
      this.newPassword = changePasswordModel.newPassword || '';
      this.confirmNewPassword = changePasswordModel.confirmNewPassword || '';
      this.oldPassword = changePasswordModel.oldPassword || '';
    }
  }
  
}

