// @ts-nocheck
import { formatDate } from '@angular/common';
export class ReservationAlert {
   reservationAlertID: number;
   customerID:number;
   reservationAlert: string;
   startDate:Date;
   startDateString:string;
   endDate:Date;
   endDateString:string;
   activationStatus:boolean;
  constructor(reservationAlert) {
    {
       this.reservationAlertID = reservationAlert.reservationAlertID || -1;
       this.customerID = reservationAlert.customerID || '';
       this.reservationAlert = reservationAlert.reservationAlert || '';
       this.startDateString = reservationAlert.startDateString || '';
       this.endDateString = reservationAlert.endDateString || '';
       this.activationStatus = reservationAlert.activationStatus || '';

       this.startDate=new Date();
       this.endDate=new Date();
    }
  }
  
}

