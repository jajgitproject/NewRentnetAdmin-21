// @ts-nocheck
import { formatDate } from '@angular/common';
export class AcrisCodeDropDown {
  acrisCodeDetailsID: number;
   acrisCode: string;

  constructor(acrisCodeDropDown) {
    {
       this.acrisCodeDetailsID = acrisCodeDropDown.acrisCodeDetailsID || -1;
       this.acrisCode = acrisCodeDropDown.acrisCode || '';
    }
  }
  
}

