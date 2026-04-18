// @ts-nocheck
import { formatDate } from '@angular/common';
export class PaymentCycle {
   paymentCycleID: number;
   paymentCycle: string;
   numberOfDays: number;
   activationStatus: boolean;
   updatedBy:number;
   updateDateTime: Date;
   userID:number;

  constructor(paymentCycle) {
    {
       this.paymentCycleID = paymentCycle.paymentCycleID || -1;
       this.paymentCycle = paymentCycle.paymentCycle || '';
       this.numberOfDays = paymentCycle.numberOfDays || '';
       this.activationStatus = paymentCycle.activationStatus || '';
       this.updatedBy=paymentCycle.updatedBy || 10;
       this.updateDateTime = paymentCycle.updateDateTime;
    }
  }
  
}

