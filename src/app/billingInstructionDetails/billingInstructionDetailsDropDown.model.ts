// @ts-nocheck
import { formatDate } from '@angular/common';
export class BillingInstructionDetailsDropDown {
 
   billingInstructionDetailsID: number;
   billingInstructionDetails: string;

  constructor(billingInstructionDetailsDropDown) {
    {
       this.billingInstructionDetailsID = billingInstructionDetailsDropDown.billingInstructionDetailsID || -1;
       this.billingInstructionDetails = billingInstructionDetailsDropDown.billingInstructionDetails || '';
    }
  }
  
}

