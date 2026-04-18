// @ts-nocheck
import { formatDate } from '@angular/common';
export class BillingCycleNameDropDown {
   billingCycleID: number;
   billingCycleName: string;
   
  constructor(billingCycleNameDropDown) {
    {
       this.billingCycleID = billingCycleNameDropDown.billingCycleID || -1;
       this.billingCycleName = billingCycleNameDropDown.billingCycleName || ''; 
      
    }
  }
  
}

