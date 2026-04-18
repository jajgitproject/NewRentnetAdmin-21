// @ts-nocheck
import { formatDate } from '@angular/common';
export class cancelAllotment {
   currencyID: number;
   currencyName: string;
   currencyCode: string;
   currencySign: string;

  constructor(cancelAllotment) {
    {
       this.currencyID = cancelAllotment.currencyID || -1;
       this.currencyName = cancelAllotment.currency || '';
       this.currencyCode = cancelAllotment.currencyCode  || '';
       this.currencySign = cancelAllotment.currencySign || '';
    }
  }
  
}

