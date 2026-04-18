// @ts-nocheck
import { formatDate } from '@angular/common';
export class ReservationStopDetailsDropDown {
 
   reservationStopDetailsID: number;
   reservationStopDetailsName: string;
   gender:string;
   importance:string;

  constructor(reservationStopDetailsDropDown) {
    {
       this.reservationStopDetailsID = reservationStopDetailsDropDown.reservationStopDetailsID || -1;
       this.reservationStopDetailsName = reservationStopDetailsDropDown.reservationStopDetailsName || '';
       this.gender = reservationStopDetailsDropDown.gender || '';
       this.importance = reservationStopDetailsDropDown.importance || '';
    }
  }
  
}

