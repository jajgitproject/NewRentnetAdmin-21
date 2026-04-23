// @ts-nocheck
import { formatDate } from '@angular/common';
export class ReservationSource {
   reservationSourceID: number;
   userID:number;
   reservationSource: string;
   activationStatus: boolean;

  constructor(reservationSource) {
    {
       this.reservationSourceID = reservationSource.reservationSourceID || -1;
       this.reservationSource = reservationSource.reservationSource || '';
       this.activationStatus = reservationSource.activationStatus || '';
    }
  }
  
}

