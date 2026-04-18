// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerReservationExecutive {
  customerReservationExecutiveID: number;
  customerID : number;
  employeeID : number;
  employee:string;
  fromDate :Date;
  toDate :Date;
 toDateString:string;
  fromDateString:string;
   activationStatus: Boolean;
   employeeName:string;

  constructor(customerReservationExecutive) {
    {
       this.customerReservationExecutiveID = customerReservationExecutive.customerReservationExecutiveID || -1;
       this.customerID = customerReservationExecutive.customerID || '';
       this.employeeID = customerReservationExecutive.employeeID || '';
      
       this.fromDateString = customerReservationExecutive.fromDateString || '';
       this.toDateString = customerReservationExecutive.toDateString || '';
       this.activationStatus = customerReservationExecutive.activationStatus || '';
       this.fromDate=new Date();
       this.toDate=new Date();
    }
  }
  
}

