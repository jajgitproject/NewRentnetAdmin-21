// @ts-nocheck
import { formatDate } from '@angular/common';
export class SettledRates {
   settledRatesID: number;
   settledRates: string;
   activationStatus: string;
   updatedBy:number;
   updateDateTime: Date;

  constructor(settledRates) {
    {
       this.settledRatesID = settledRates.settledRatesID || -1;
       this.settledRates = settledRates.settledRates || '';
       this.activationStatus = settledRates.activationStatus || '';
       this.updatedBy=settledRates.updatedBy || 10;
       this.updateDateTime = settledRates.updateDateTime;
    }
  }
  
}

