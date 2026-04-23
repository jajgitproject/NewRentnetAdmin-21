// @ts-nocheck
import { formatDate } from '@angular/common';
export class CancelReservationAndAllotment {
  allotmentID: number;
   dateOfCancellation: Date;
   timeOfCancellation:string;
   cancellationByEmployeeID:number;
   cancellationRemark: string;
   allotmentStatus: string;
   userID:number;
   reservationID:number;
   cancellationProof:string;
   isCancellationChargeable:boolean;
   allotmentType:string;
  

  constructor(cancelReservationAndAllotment) {
    {
       this.allotmentID = cancelReservationAndAllotment.allotmentID || 0;
       this.dateOfCancellation = cancelReservationAndAllotment.DateOfCancellation || '';
       this.timeOfCancellation = cancelReservationAndAllotment.timeOfCancellation || '';
       this.cancellationByEmployeeID = cancelReservationAndAllotment.cancellationByEmployeeID || '';
       this.cancellationRemark = cancelReservationAndAllotment.cancellationRemark || '';
       this.allotmentStatus = cancelReservationAndAllotment.allotmentStatus || '';
       this.userID = cancelReservationAndAllotment.userID || '';
       this.reservationID = cancelReservationAndAllotment.reservationID || '';
       this.cancellationProof = cancelReservationAndAllotment.cancellationProof || '';
       this.isCancellationChargeable = cancelReservationAndAllotment.isCancellationChargeable || '';
    }
  }
  
}

