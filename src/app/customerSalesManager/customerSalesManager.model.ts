// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerSalesManager {
  customerSalesManagerID: number;
  customerID : number;
  employeeID : number;
  serviceDescription:string;
  attachmentStatus:string;
  fromDate :Date;
  endDate :Date;
  employee:string;
  endDateString:string;
  fromDateString:string;
   activationStatus: Boolean;
   employeeName:string;
  userID: number;
  isDefaultSalesManager: boolean;
  

  constructor(customerSalesManager) {
    {
       this.customerSalesManagerID = customerSalesManager.customerSalesManagerID || -1;
       this.customerID = customerSalesManager.customerID || '';
       this.employeeID = customerSalesManager.employeeID || '';
       this.serviceDescription = customerSalesManager.serviceDescription || '';
       this.attachmentStatus = customerSalesManager.attachmentStatus || '';     
       this.fromDateString = customerSalesManager.fromDateString || '';
       this.endDateString = customerSalesManager.endDateString || '';
       this.activationStatus = customerSalesManager.activationStatus || '';
             this.isDefaultSalesManager = customerSalesManager.isDefaultSalesManager || '';
       this.fromDate=new Date();
       //this.endDate=new Date();
    }
  }
  
}

