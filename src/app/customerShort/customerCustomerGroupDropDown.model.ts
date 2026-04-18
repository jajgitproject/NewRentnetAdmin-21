// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerCustomerGroupDropDown {
 
   customerID: number;
   customerName: string;
   customerGroupID: number;
   customerGroup: string;

  constructor(customerCustomerGroupDropDown) {
    {
       this.customerID = customerCustomerGroupDropDown.customerID || '';
       this.customerName = customerCustomerGroupDropDown.customerName || '';
       this.customerGroupID = customerCustomerGroupDropDown.customerGroupID || '';
       this.customerGroup = customerCustomerGroupDropDown.customerGroup || '';
    }
  }
  
}

