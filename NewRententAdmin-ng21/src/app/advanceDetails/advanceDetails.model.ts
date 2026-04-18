// @ts-nocheck
import { formatDate } from '@angular/common';
export class AdvanceDetails {
   reservationAdvanceDetailsID: number;
   reservationID:number;
   advanceAmount:number;
   dateOfAdvanceReceived:Date;
   dateOfAdvanceReceivedString:string;
   modeOfPayment:string;
   referenceNumber:string;
   advanceRemark:string;
   activationStatus:boolean;
userID:number
  constructor(advanceDetails) {
    {
       this.reservationAdvanceDetailsID = advanceDetails.reservationAdvanceDetailsID || -1;
       this.reservationID = advanceDetails.reservationID || '';
       this.advanceAmount = advanceDetails.advanceAmount || '';
       this.dateOfAdvanceReceivedString=advanceDetails.dateOfAdvanceReceivedString || '';
       this.referenceNumber = advanceDetails.referenceNumber || '';
       this.advanceRemark = advanceDetails.advanceRemark || '';
       this.activationStatus = advanceDetails.activationStatus || '';

       this.dateOfAdvanceReceived=new Date();
    }
  }
  
}

