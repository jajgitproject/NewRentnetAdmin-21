// @ts-nocheck
import { formatDate } from '@angular/common';
export class ModeOfPayment {
   modeOfPaymentID: number;
   modeOfPayment: string;
   activationStatus: boolean;
   updatedBy:number;
   updateDateTime: Date;
   userID:number;
   oldRentNetPaymentMode:string

  constructor(modeOfPayment) {
    {
       this.modeOfPaymentID = modeOfPayment.modeOfPaymentID || -1;
       this.modeOfPayment = modeOfPayment.modeOfPayment || '';
       this.activationStatus = modeOfPayment.activationStatus || '';
       this.updatedBy=modeOfPayment.updatedBy || 10;
       this.updateDateTime = modeOfPayment.updateDateTime;
       this.oldRentNetPaymentMode=modeOfPayment.oldRentNetPaymentMode || '';
    }
  }
  
}

