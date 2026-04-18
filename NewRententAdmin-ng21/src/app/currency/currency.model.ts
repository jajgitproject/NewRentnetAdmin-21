// @ts-nocheck
import { formatDate } from '@angular/common';
export class Currency {
   currencyID: number;
   currencyName: string;
   currencyCode:string;
   currencySign:string
   activationStatus: Boolean;
  
   userID:number;
  constructor(currency) {
    {
       this.currencyID = currency.currencyID || -1;
       this.currencyName = currency.currencyName || '';
       this.currencyCode = currency.currencyCode || '';
       this.currencySign = currency.currencySign || '';
       this.activationStatus = currency.activationStatus || '';
    }
  }
  
}

