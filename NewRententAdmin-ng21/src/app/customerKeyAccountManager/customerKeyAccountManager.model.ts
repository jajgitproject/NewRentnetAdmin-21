// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerKeyAccountManager {
  customerKeyAccountManagerID: number;
  customerID : number;
  employeeID : number;
  serviceDescription:string;
  attachmentStatus:string;
  fromDate :Date;
  endDate :Date;
  endDateString:string;
  fromDateString:string;
   activationStatus: Boolean;
   employeeName:string;
   employee:string;
   cityID:number;
   city:string;
  userID: number;
  isDefaultKeyAccountManager: boolean;

  constructor(customerKeyAccountManager) {
    {
       this.customerKeyAccountManagerID = customerKeyAccountManager.customerKeyAccountManagerID || -1;
       this.customerID = customerKeyAccountManager.customerID || '';
       this.employeeID = customerKeyAccountManager.employeeID || '';
       this.serviceDescription = customerKeyAccountManager.serviceDescription || '';
       this.attachmentStatus = customerKeyAccountManager.attachmentStatus || '';     
       this.fromDateString = customerKeyAccountManager.fromDateString || '';
       this.endDateString = customerKeyAccountManager.endDateString || '';
       this.activationStatus = customerKeyAccountManager.activationStatus || '';
       this.cityID=customerKeyAccountManager.cityID || '';
       this.city=customerKeyAccountManager.city || '';
        this.isDefaultKeyAccountManager=customerKeyAccountManager.isDefaultKeyAccountManager || '';
       this.fromDate=new Date();
      //  this.endDate=new Date();
    }
  }
  
}

