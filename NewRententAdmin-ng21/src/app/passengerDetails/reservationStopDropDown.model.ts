// @ts-nocheck
import { formatDate } from '@angular/common';
export class ReservationStopDropDown {
   reservationStopID: number;
   reservationStopAddress: string;

  constructor(reservationStopDropDown) {
    {
       this.reservationStopID = reservationStopDropDown.reservationStopID || -1;
       this.reservationStopAddress = reservationStopDropDown.reservationStopAddress || '';
    }
  }
  
}

