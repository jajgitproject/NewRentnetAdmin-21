// @ts-nocheck
import { formatDate } from '@angular/common';
export class ReservationAlertDropDown {
 
   reservationAlertID: number;
   reservationAlert: string;

  constructor(reservationAlertDropDown) {
    {
       this.reservationAlertID = reservationAlertDropDown.reservationAlertID || -1;
       this.reservationAlert = reservationAlertDropDown.reservationAlert || '';
    }
  }
  
}

