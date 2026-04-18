// @ts-nocheck
import { formatDate } from '@angular/common';
export class currencyDropDown {
   currencyID: number;
   currencyName: string;
   currencyCode: string;
   currencySign: string;

  constructor(currencyDropDown) {
    {
       this.currencyID = currencyDropDown.currencyID || -1;
       this.currencyName = currencyDropDown.currency || '';
       this.currencyCode = currencyDropDown.currencyCode  || '';
       this.currencySign = currencyDropDown.currencySign || '';
    }
  }
  
}

