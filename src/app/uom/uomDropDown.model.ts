// @ts-nocheck
import { formatDate } from '@angular/common';
export class UomDropDown {
   uomID: number;
   uom: string;

  constructor(uomDropDown) {
    {
       this.uomID = uomDropDown.uomID || -1;
       this.uom = uomDropDown.uom || '';
    }
  }
  
}

