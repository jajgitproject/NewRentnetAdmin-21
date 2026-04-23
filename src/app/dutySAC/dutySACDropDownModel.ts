// @ts-nocheck
import { formatDate } from '@angular/common';
export class DutySACCDropDown {
   sacid: number;
   sacNumber: string;

  constructor(dutySACDropDown) {
    {
       this.sacid = dutySACDropDown.sacid || -1;
       this.sacNumber = dutySACDropDown.sacNumber || '';
    }
  }
  
}

