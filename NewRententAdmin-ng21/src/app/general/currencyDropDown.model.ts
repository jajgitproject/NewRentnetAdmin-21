// @ts-nocheck
import { formatDate } from '@angular/common';
export class CurrencyDropDown {
   currencyID: number;
   currencyName: string;

  constructor(currencyDropDown) {
    {
       this.currencyID = currencyDropDown.currencyID || -1;
       this.currencyName = currencyDropDown.currencyName || '';
    }
  }
  
}

