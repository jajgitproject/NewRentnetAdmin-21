// @ts-nocheck
import { formatDate } from '@angular/common';
export class UnlockEmployee {
   employeeID: number;
   employeeEntityName: string;
   lastName:string;
   mobile:string;
   email:string;
  userType:string='Employee';
   employmentStatus:string;
   employeeEntityPasswordID:number;
   activationStatus: boolean;
  
  constructor(unlockEmployee) {
    {
       this.employeeID = unlockEmployee.employeeID || '';
       this.employeeEntityName=unlockEmployee.employeeEntityName || '';
       this.employeeEntityPasswordID = unlockEmployee.employeeEntityPasswordID || '';
       this.lastName=unlockEmployee.lastName || '';
       this.mobile=unlockEmployee.mobile || '';
       this.email=unlockEmployee.email || '';
       this.activationStatus = unlockEmployee.activationStatus || '';
      
     
    }
  }
  
}

