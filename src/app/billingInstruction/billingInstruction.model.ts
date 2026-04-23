// @ts-nocheck
import { formatDate } from '@angular/common';
export class BillingInstruction {
   billingInstructionID: number;
   billingInstruction: string;
   activationStatus: string;
   updatedBy:number;
   updateDateTime: Date;
   userID:number
  constructor(billingInstruction) {
    {
      this.billingInstructionID = billingInstruction.billingInstructionID || -1;
      this.billingInstruction = billingInstruction.billingInstruction || '';
       this.activationStatus = billingInstruction.activationStatus || '';
       this.updatedBy=billingInstruction.updatedBy || 10;
       this.updateDateTime = billingInstruction.updateDateTime;
    }
  }
  
}

