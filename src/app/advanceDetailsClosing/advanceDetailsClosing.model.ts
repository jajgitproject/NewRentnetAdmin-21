// @ts-nocheck
import { formatDate } from '@angular/common';
export class AdvanceDetailsClosing {
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
  constructor(advanceDetailsClosing) {
    {
       this.reservationAdvanceDetailsID = advanceDetailsClosing.reservationadvanceDetailsClosingID || -1;
       this.reservationID = advanceDetailsClosing.reservationID || '';
       this.advanceAmount = advanceDetailsClosing.advanceAmount || '';
       this.dateOfAdvanceReceivedString=advanceDetailsClosing.dateOfAdvanceReceivedString || '';
       this.referenceNumber = advanceDetailsClosing.referenceNumber || '';
       this.advanceRemark = advanceDetailsClosing.advanceRemark || '';
       this.activationStatus = advanceDetailsClosing.activationStatus || '';

       this.dateOfAdvanceReceived=new Date();
    }
  }
  
}

