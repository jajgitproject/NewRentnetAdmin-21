// @ts-nocheck
import { formatDate } from '@angular/common';
export class AdditionalServiceRateDropDown {
 
   additionalServiceRateID: number;
   additionalServiceID: number;

  constructor(additionalServiceRateDropDown) {
    {
       this.additionalServiceRateID = additionalServiceRateDropDown.additionalServiceRateID || -1;
       this.additionalServiceID = additionalServiceRateDropDown.additionalServiceID || '';
    }
  }
  
}

