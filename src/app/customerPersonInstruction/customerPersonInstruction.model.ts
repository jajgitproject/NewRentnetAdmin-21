// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerPersonInstruction {
   customerPersonInstructionID: number;
   customerPersonID:number;
   instruction:string;
  
   activationStatus:boolean;
   userID:number;
  constructor(customerPersonInstruction) {
    {
       this.customerPersonInstructionID = customerPersonInstruction.customerPersonInstructionID || -1;
       this.customerPersonID = customerPersonInstruction.customerPersonID || '';
       
       this.instruction = customerPersonInstruction.instruction || '';
       this.activationStatus = customerPersonInstruction.activationStatus || '';
    }
  }
  
}

