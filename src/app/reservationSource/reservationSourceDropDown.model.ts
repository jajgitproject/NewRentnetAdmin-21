// @ts-nocheck
import { formatDate } from '@angular/common';
export class ReservationSourceDropDown {
   reservationSourceID: number;
   reservationSource: string;

  constructor(reservationSourceDropDown) {
    {
       this.reservationSourceID = reservationSourceDropDown.reservationSourceID || -1;
       this.reservationSource = reservationSourceDropDown.reservationSource || '';
    }
  }
  
}

