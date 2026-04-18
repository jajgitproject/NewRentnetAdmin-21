// @ts-nocheck
import { formatDate } from '@angular/common';
export class BillingInstructionsDetails {
  reservationBillingInstructionID: number;
  reservationID:number;
  reservationBillingInstruction: string;
  reservationBillingInstructionAttachment:string;
  reservationBillingInstructionByEmployeeID:number;
  reservationBillingInstructionByEmployee:string;
  activationStatus: boolean;
  userID:number
  constructor(billingInstructionsDetails) {
    {
      this.reservationBillingInstructionID = billingInstructionsDetails.reservationBillingInstructionID || -1;
      this.reservationID = billingInstructionsDetails.reservationID || '';
       this.reservationBillingInstruction = billingInstructionsDetails.reservationBillingInstruction || '';
       this.reservationBillingInstructionAttachment = billingInstructionsDetails.reservationBillingInstructionAttachment || '';
       this.reservationBillingInstructionByEmployeeID = billingInstructionsDetails.reservationBillingInstructionByEmployeeID || '';
       this.activationStatus = billingInstructionsDetails.activationStatus || '';
    }
  }
  
}

