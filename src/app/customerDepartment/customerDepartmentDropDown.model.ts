// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerDepartmentDropDown {
 
  customerDepartmentID: number;
  customerDepartment: string;

  constructor(customerDepartment) {
    {
       this.customerDepartmentID = customerDepartment.customerDepartmentID || -1;
       this.customerDepartment = customerDepartment.customerDepartment || '';
    }
  }
  
}

