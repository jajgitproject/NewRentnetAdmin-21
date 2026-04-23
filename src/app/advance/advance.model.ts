// @ts-nocheck
import { formatDate } from '@angular/common';
export class Advance {
   advanceID: number;
   advance: string;
   activationStatus: string;
   updatedBy:number;
   updateDateTime: Date;

  constructor(advance) {
    {
       this.advanceID = advance.advanceID || -1;
       this.advance = advance.advance || '';
       this.activationStatus = advance.activationStatus || '';
       this.updatedBy=advance.updatedBy || 10;
       this.updateDateTime = advance.updateDateTime;
    }
  }
  
}

