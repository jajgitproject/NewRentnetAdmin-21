// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerBillingExecutive {
  customerBillingExecutiveID: number;
  customerID : number;
  employeeID : number;
  
  fromDate :Date;
  toDate :Date;
 toDateString:string;
  fromDateString:string;
   activationStatus: Boolean;
   employeeName:string;
   employee:string;

  constructor(customerBillingExecutive) {
    {
       this.customerBillingExecutiveID = customerBillingExecutive.customerBillingExecutiveID || -1;
       this.customerID = customerBillingExecutive.customerID || '';
       this.employeeID = customerBillingExecutive.employeeID || '';
      
       this.fromDateString = customerBillingExecutive.fromDateString || '';
       this.toDateString = customerBillingExecutive.toDateString || '';
       this.activationStatus = customerBillingExecutive.activationStatus || '';
       this.fromDate=new Date();
       //this.toDate=new Date();
    }
  }
  
}

