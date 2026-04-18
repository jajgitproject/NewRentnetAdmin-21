// @ts-nocheck
import { formatDate } from '@angular/common';
export class SpecialInstruction {
  reservationSpecialInstructionID: number;
  reservationID: string;
   activationStatus: boolean;
   specialInstruction:string;
   specialInstructionBy: string;
   specialInstructionAttachment: string;
userID:number
  constructor(specialInstruction) {
    {
       this.reservationSpecialInstructionID = specialInstruction.reservationSpecialInstructionID || -1;
       this.reservationID = specialInstruction.reservationID || '';
       this.activationStatus = specialInstruction.activationStatus || '';
       this.specialInstruction=specialInstruction.specialInstruction || '';
       this.specialInstructionBy=specialInstruction.specialInstructionBy || '';
       this.specialInstructionAttachment = specialInstruction.specialInstructionAttachment;
    }
  }
  
}

