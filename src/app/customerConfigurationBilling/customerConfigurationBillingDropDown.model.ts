// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerConfigurationBillingDropDown {
 
   customerConfigurationBillingID: number;
   customerConfigurationBilling: string;

  constructor(customerConfigurationBillingDropDown) {
    {
       this.customerConfigurationBillingID = customerConfigurationBillingDropDown.customerConfigurationBillingID || -1;
       this.customerConfigurationBilling = customerConfigurationBillingDropDown.customerConfigurationBilling || '';
    }
  }
  
}

