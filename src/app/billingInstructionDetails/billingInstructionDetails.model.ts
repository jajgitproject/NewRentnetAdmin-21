// @ts-nocheck
import { formatDate } from '@angular/common';
export class BillingInstructionDetails {
   billingInstructionDetailsID: number;
   billingInstructionDetails: string;
   activationStatus:boolean;
  constructor(billingInstructionDetails) {
    {
       this.billingInstructionDetailsID = billingInstructionDetails.billingInstructionDetailsID || -1;
       this.billingInstructionDetails = billingInstructionDetails.billingInstructionDetails || '';
       this.activationStatus = billingInstructionDetails.activationStatus || '';
    }
  }
  
}

