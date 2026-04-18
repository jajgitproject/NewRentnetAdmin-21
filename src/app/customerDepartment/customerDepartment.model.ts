// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerDepartment {
  customerDepartmentID: number;
  customerGroupID: number;
  customerDepartment: string;
   activationStatus:boolean;
   userID:number;
  constructor(customerDepartment) {
    {
       this.customerDepartmentID = customerDepartment.customerDepartmentID || -1;
       this.customerGroupID = customerDepartment.customerGroupID || '';
       this.customerDepartment = customerDepartment.customerDepartment || '';
       this.activationStatus = customerDepartment.activationStatus || '';
    }
  }
  
}

