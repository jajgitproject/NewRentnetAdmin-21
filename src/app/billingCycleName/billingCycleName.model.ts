// @ts-nocheck
import { formatDate } from '@angular/common';
export class BillingCycleName {
   billingCycleID: number;
   billingCycleName: string;
   activationStatus:boolean;
   userID:number;

  constructor(billingCycleName) {
    {
       this.billingCycleID = billingCycleName.billingCycleID || -1;
       this.billingCycleName = billingCycleName.billingCycleName || ''; 
       this.activationStatus = billingCycleName.activationStatus || '';
       this.userID = billingCycleName.userID || '';
    }
  }
  
}

