// @ts-nocheck
import { formatDate } from '@angular/common';
export class Uom {
   uomid: number;
   userID:number;
   uom: string;
   uomCode: string;
   activationStatus: Boolean;
  

  constructor(uom) {
    {
       this.uomid = uom.uomid || -1;
       this.uom = uom.uom || '';
       this.uomCode = uom.uomCode || '';
       this.activationStatus = uom.activationStatus || '';
      
    }
  }
  
}

