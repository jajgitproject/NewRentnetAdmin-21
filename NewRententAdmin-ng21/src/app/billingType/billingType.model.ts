// @ts-nocheck
import { formatDate } from '@angular/common';
export class BillingType {
   billingTypeID: number;
   billingTypeName: string;
   userID:number;
   activationStatus: boolean;

  constructor(billingType) {
    {
       this.billingTypeID = billingType.billingTypeID || -1;
       this.billingTypeName = billingType.billingTypeName || '';
       this.activationStatus = billingType.activationStatus || '';
    }
  }
  
}

