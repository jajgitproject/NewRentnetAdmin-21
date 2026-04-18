// @ts-nocheck
import { formatDate } from '@angular/common';
export class cancelAttotment {
   currencyID: number;
   currencyName: string;
   currencyCode: string;
   currencySign: string;

  constructor(cancelAttotment) {
    {
       this.currencyID = cancelAttotment.currencyID || -1;
       this.currencyName = cancelAttotment.currency || '';
       this.currencyCode = cancelAttotment.currencyCode  || '';
       this.currencySign = cancelAttotment.currencySign || '';
    }
  }
  
}

