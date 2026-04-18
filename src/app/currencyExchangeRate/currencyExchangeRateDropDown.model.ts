// @ts-nocheck
import { formatDate } from '@angular/common';
export class CurrencyExchangeRateDropDown {
 
   currencyExchangeRateID: number;
   name: string;

  constructor(currencyExchangeRateDropDown) {
    {
       this.currencyExchangeRateID = currencyExchangeRateDropDown.currencyExchangeRateID || -1;
       this.name = currencyExchangeRateDropDown.name || '';
    }
  }
  
}

