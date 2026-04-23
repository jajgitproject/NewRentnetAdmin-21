// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerReservationAlert {
  customerReservationAlertID: number;
  customerID: number;
  reservationAlert:string;
  startDate:Date;
    startDateString:string;
    endDate:Date;
    endDateString:string;
   activationStatus:boolean;
  constructor(customerReservationAlert) {
    {
       this.customerReservationAlertID = customerReservationAlert.customerReservationAlertID || -1;
       this.customerID = customerReservationAlert.customerID || '';
       this.reservationAlert = customerReservationAlert.reservationAlert || '';
       this.startDateString = customerReservationAlert.startDateString || '';
       this.endDateString = customerReservationAlert.endDateString || '';
       this.activationStatus = customerReservationAlert.activationStatus || '';
       this.startDate=new Date();
      //  this.endDate=new Date();
    }
  }
  
}

