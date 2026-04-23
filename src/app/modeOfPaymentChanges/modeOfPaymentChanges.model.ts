// @ts-nocheck
import { formatDate } from '@angular/common';
export class  ModeOfPaymentChange {
  reservationID:number;
  modeOfPaymentID: number;
  previousModeOfPayment:string;
  newModeOfPayment:string;
  modeOfPaymentChangeReason:string;
  userID:number;
  modeOfPaymentChangeBy:string;
  modeOfPaymentChangeDateTime:string; 
  
 constructor(modeOfPaymentChange) {
   {
      this.reservationID = modeOfPaymentChange.reservationID || '';
      this.modeOfPaymentID = modeOfPaymentChange.modeOfPaymentID || '';
      this.previousModeOfPayment = modeOfPaymentChange.previousModeOfPayment || '';
      this.newModeOfPayment = modeOfPaymentChange.newModeOfPayment || '';
      this.modeOfPaymentChangeReason = modeOfPaymentChange.modeOfPaymentChangeReason || '';
      this.modeOfPaymentChangeDateTime = modeOfPaymentChange.modeOfPaymentChangeDateTime || '';
   }
 }
}
