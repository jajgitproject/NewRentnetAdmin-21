// @ts-nocheck
import { formatDate } from '@angular/common';
export class ValidateOTP {
 
  enterOTP: string;
  email:string
  FirstName:string
  UserType:string
  EmployeeEntityID:string
  constructor(validateOTP) {
    {
      
       this.enterOTP = validateOTP.enterOTP || '';
       
    }
  }
  
}

