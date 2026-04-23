// @ts-nocheck
import { formatDate } from '@angular/common';
export class PaymentCycleDropDown {
   paymentCycleID: number;
   paymentCycle: string;

  constructor(paymentCycleDropDown) {
    {
       this.paymentCycleID = paymentCycleDropDown.paymentCycleID || -1;
       this.paymentCycle = paymentCycleDropDown.paymentCycle || '';
    }
  }
  
}

