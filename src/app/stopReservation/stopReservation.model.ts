// @ts-nocheck
import { formatDate } from '@angular/common';
export class StopReservation {
  stopReservationID: number;
  customerID : number;
  instructedByID : number;
  reason:string;
  fromDate :Date;
  toDate :Date;
 toDateString:string;
  fromDateString:string;
   activationStatus: Boolean;
   instructedBy:string;
   userID:number;
  

  constructor(stopReservation) {
    {
       this.stopReservationID = stopReservation.stopReservationID || -1;
       this.customerID = stopReservation.customerID || '';
       this.instructedByID = stopReservation.instructedByID || '';
      this.reason = stopReservation.reason ||'';
       this.fromDateString = stopReservation.fromDateString || '';
       this.toDateString = stopReservation.toDateString || '';
       this.activationStatus = stopReservation.activationStatus || '';
       this.fromDate=new Date();
       this.toDate=new Date();
    }
  }
  
}

