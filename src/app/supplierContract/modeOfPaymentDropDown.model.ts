// @ts-nocheck
import { formatDate } from '@angular/common';
export class ModeOfPaymentDropDown {
   modeOfPaymentID: number;
   modeOfPayment: string;

  constructor(modeOfPaymentDropDown) {
    {
       this.modeOfPaymentID = modeOfPaymentDropDown.modeOfPaymentID || -1;
       this.modeOfPayment = modeOfPaymentDropDown.department || '';
    }
  }
  
}

