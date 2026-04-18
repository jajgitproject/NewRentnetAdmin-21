// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerCollectionExecutive {
  customerCollectionExecutiveID: number;
  customerID : number;
  employeeID : number;
  employee:string;
  fromDate :Date;
  toDate :Date;
 toDateString:string;
  fromDateString:string;
   activationStatus: Boolean;
   employeeName:string;
  userID: number;
  

  constructor(customerCollectionExecutive) {
    {
       this.customerCollectionExecutiveID = customerCollectionExecutive.customerCollectionExecutiveID || -1;
       this.customerID = customerCollectionExecutive.customerID || '';
       this.employeeID = customerCollectionExecutive.employeeID || '';
      
       this.fromDateString = customerCollectionExecutive.fromDateString || '';
       this.toDateString = customerCollectionExecutive.toDateString || '';
       this.activationStatus = customerCollectionExecutive.activationStatus || '';
       this.fromDate=new Date();
       //this.toDate=new Date();
    }
  }
  
}

