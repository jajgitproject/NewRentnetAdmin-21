// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerBillingCycle {
  customerBillingCycleID: number;
  customerID: number;
  billingCycleNameID: number;
  billingTypeID:number;
  billingTypeName:string;
  billingCycleName:string;
  userID:number;
  activationStatus:boolean;

  
  constructor(customerBillingCycle) {
    {
       this.customerBillingCycleID = customerBillingCycle.customerBillingCycleID || -1;
       this.customerID = customerBillingCycle.customerID || '';
       this.billingCycleNameID = customerBillingCycle.billingCycleNameID || '';
       this.billingTypeID = customerBillingCycle.billingTypeID || '';
       this.billingCycleName = customerBillingCycle.billingCycleName || '';
       this.billingTypeName = customerBillingCycle.billingTypeName || '';
       this.activationStatus = customerBillingCycle.activationStatus || '';
    }
  }
  
}

