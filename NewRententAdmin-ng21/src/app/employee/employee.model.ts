// @ts-nocheck
import { formatDate } from '@angular/common';
export class Employee {
   employeeID: number;
   firstName: string;
   lastName:string;
   gender:string;
   reportingManagerID:number;
   reportingManager:string;
   mobile:string;
   email:string;
   employeeOf:string;
   supplierName:string;
   supplierID:string;
   role:string;
   roleID:number;
   employeeOfficeID:string;
  //  loginName:string;
    organizationalEntityName:string;
   //contractValidUpToString:string;
   //contractValidUpTo:Date;
   employmentStatus:string;
   dateOfLeavingString:string;
   dateOfLeaving:Date;
   activationStatus: boolean;
  // password:string;
  // confirmPassword:string;
  countryCodes:string;
  employeeAttachedToLocationID:number;
  employeeAttachedToLocation:string;
  packageAmount:boolean;
  vpn:boolean;
  reason:string;
  userID:number;
  showAllLocation:boolean;
   oldRenNetID:number;
  constructor(employee) {
    {
       this.employeeID = employee.employeeID || -1;
       this.firstName=employee.firstName || '';
       this.lastName=employee.lastName || '';
       this.gender=employee.gender || '';
       this.reportingManagerID=employee.reportingManagerID || '';
       this.mobile=employee.mobile || '';
       this.email=employee.email || '';
       this.employeeOf=employee.employeeOf || '';
       this.supplierID=employee.supplierID || '';
       this.roleID=employee.roleID || '';
       this.employeeOfficeID=employee.employeeOfficeID || '';
       //this.loginName=employee.loginName || '';
       this.employeeAttachedToLocationID=employee.employeeAttachedToLocationID || '';
      // this.contractValidUpToString=employee.contractValidUpToString || '';
       this.employmentStatus=employee.employmentStatus || '';
       this.dateOfLeavingString=employee.dateOfLeavingString || '';
       this.activationStatus = employee.activationStatus || '';
           this.oldRenNetID = (employee.oldRenNetID && employee.oldRenNetID !== 0) ? Number(employee.oldRenNetID) : null;
      //  this.confirmPassword = employee.confirmPassword || '';
      //  this.organizationalEntityID = employee.organizationalEntityID || '';
        this.employeeAttachedToLocation = employee.employeeAttachedToLocation || '';
       this.packageAmount = employee.packageAmount || '';
       this.vpn = employee.vpn || '';
       this.reason = employee.reason || '';
      this.showAllLocation=employee.showAllLocation || '';
       //this.contractValidUpTo=new Date();
       //this.dateOfLeaving=new Date();
     
    }
  }
  
}

export class MobileEmailModel{
  mobile: string;
  email: string;
  isDuplicate: boolean;
}
