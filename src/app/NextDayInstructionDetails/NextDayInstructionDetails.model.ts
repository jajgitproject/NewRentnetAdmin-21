// @ts-nocheck
import { formatDate } from '@angular/common';
export class NextDayInstructionDetails {
  nextDayInstructionDate:Date
  nextDayInstructionDateString:string;
  nextDayInstructionTime:Date
  nextDayInstructionTimeString:string;
   nextDayInstruction: string;
   activationStatus: boolean;

  constructor(nextDayInstructionDetails) {
    {
      //  this.nextDayInstructionID = nextDayInstruction.nextDayInstructionID || -1;
       this.nextDayInstruction = nextDayInstructionDetails.nextDayInstruction || '';
       this.nextDayInstructionDateString = nextDayInstructionDetails.nextDayInstructionDateString || '';
       this.nextDayInstructionTimeString = nextDayInstructionDetails.nextDayInstructionTimeString || '';
       this.activationStatus = nextDayInstructionDetails.activationStatus || '';
       this.nextDayInstructionDate=new Date();
       this.nextDayInstructionTime=new Date();
    
    }
  }
  
}

