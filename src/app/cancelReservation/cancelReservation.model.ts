// @ts-nocheck
import { formatDate } from '@angular/common';
export class CancelReservation {
  reservationID: number;
  cancellationReason: string;
  
  constructor(cancelReservation) {
    {
       this.reservationID = cancelReservation.reservationID || '';
       this.cancellationReason = cancelReservation.cancellationReason || '';
  
    }
  }
  
}

