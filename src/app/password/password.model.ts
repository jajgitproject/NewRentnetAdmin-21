// @ts-nocheck
import { formatDate } from '@angular/common';
export class Password {
   currentpassword: string;
   newPassword: string;
   confirmNewPassword: string;
   employeeEntityID:number;
   employeeEntityPasswordID:number;
   passwordType:string;
   userType:string;
  constructor(password) {
    {
      //  this.passwordID = password.passwordID || -1;
       this.currentpassword = password.password || '';
       this.newPassword = password.newPassword || '';
       this.employeeEntityID=password.employeeEntityID || '';
       this.employeeEntityPasswordID=password.employeeEntityPasswordID || '';
       this.passwordType=password.passwordType || '';
       this.userType=password.userType || '';
    }
  }
  
}

