// @ts-nocheck
import { formatDate } from '@angular/common';
export class SpecialInstructionInfo {
   SpecialInstructionInfoID: number;
   SpecialInstructionInfo: string;
   activationStatus: string;
   updatedBy:number;
   updateDateTime: Date;

  constructor(SpecialInstructionInfo) {
    {
       this.SpecialInstructionInfoID = SpecialInstructionInfo.SpecialInstructionInfoID || -1;
       this.SpecialInstructionInfo = SpecialInstructionInfo.SpecialInstructionInfo || '';
       this.activationStatus = SpecialInstructionInfo.activationStatus || '';
       this.updatedBy=SpecialInstructionInfo.updatedBy || 10;
       this.updateDateTime = SpecialInstructionInfo.updateDateTime;
    }
  }
  
}

