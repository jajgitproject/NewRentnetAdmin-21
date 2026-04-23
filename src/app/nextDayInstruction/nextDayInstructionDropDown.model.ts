// @ts-nocheck
import { formatDate } from '@angular/common';
export class NextDayInstructionDropDown {
   nextDayInstructionID: number;
   nextDayInstruction: string;

  constructor(nextDayInstructionDropDown) {
    {
       this.nextDayInstructionID = nextDayInstructionDropDown.nextDayInstructionID || -1;
       this.nextDayInstruction = nextDayInstructionDropDown.nextDayInstruction || '';
    }
  }
  
}

