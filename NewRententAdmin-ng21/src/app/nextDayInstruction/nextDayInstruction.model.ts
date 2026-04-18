// @ts-nocheck
import { formatDate } from '@angular/common';
export class NextDayInstruction {
  nextDayInstructionDate:Date
  nextDayInstructionDateString:string;
  nextDayInstructionTime:Date
  nextDayInstructionTimeString:string;
   nextDayInstruction: string;
   activationStatus: boolean;
   dutySlipID:number;
   userID:number;

  constructor(nextDayInstruction) {
    {
      //  this.nextDayInstructionID = nextDayInstruction.nextDayInstructionID || -1;
      this.dutySlipID = nextDayInstruction.dutySlipID || -1;
       this.nextDayInstruction = nextDayInstruction.nextDayInstruction || '';
       this.nextDayInstructionDateString = nextDayInstruction.nextDayInstructionDateString || '';
       this.nextDayInstructionTimeString = nextDayInstruction.nextDayInstructionTimeString || '';
       this.activationStatus = nextDayInstruction.activationStatus || '';
       this.nextDayInstructionDate=new Date();
       this.nextDayInstructionTime=new Date();
    
    }
  }
  
}

