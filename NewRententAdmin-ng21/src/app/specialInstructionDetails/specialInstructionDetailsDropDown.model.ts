// @ts-nocheck
import { formatDate } from '@angular/common';
export class SpecialInstructionDetailsDropDown {
 
   specialInstructionDetailsID: number;
   specialInstructionDetails: string;

  constructor(specialInstructionDetailsDropDown) {
    {
       this.specialInstructionDetailsID = specialInstructionDetailsDropDown.specialInstructionDetailsID || -1;
       this.specialInstructionDetails = specialInstructionDetailsDropDown.specialInstructionDetails || '';
    }
  }
  
}

