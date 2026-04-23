// @ts-nocheck
import { formatDate } from '@angular/common';
export class BillingTypeDropDown {
     billingTypeID: number;
   billingTypeName: string;
 

  constructor(billingType) {
    {
       this.billingTypeID = billingType.billingTypeID || -1;
       this.billingTypeName = billingType.billingTypeName || '';
    }
  }
  
}

