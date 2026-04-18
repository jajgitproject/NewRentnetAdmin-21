// @ts-nocheck
import { formatDate } from '@angular/common';
export class SpecialInstructionDetails {
  reservationID: string;
  allotmentID: number;
  reservationSpecialInstructionID: number;
   activationStatus: boolean;
   specialInstruction:string;
   specialInstructionBy: string;
   specialInstructionAttachment: string;
   userID:number
  constructor(specialInstructionDetails) {
    {
      this.reservationSpecialInstructionID = specialInstructionDetails.reservationSpecialInstructionID || -1;
       this.reservationID = specialInstructionDetails.reservationID || '';
       this.allotmentID = specialInstructionDetails.allotmentID || -1;
       this.activationStatus = specialInstructionDetails.activationStatus || '';
       this.specialInstruction=specialInstructionDetails.specialInstruction || '';
       this.specialInstructionBy=specialInstructionDetails.specialInstructionBy || '';
       this.specialInstructionAttachment = specialInstructionDetails.specialInstructionAttachment;
    }
  }
  
}

