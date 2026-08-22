// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerCustomerGroupDropDown {
 
   customerID: number;
   customerName: string;
   customerGroupID: number;
   customerGroup: string;
   tallyCustomerID: number;
   tallyIntegrationCode: string;

  constructor(customerCustomerGroupDropDown) {
    {
       this.customerID = customerCustomerGroupDropDown.customerID || '';
       this.customerName = customerCustomerGroupDropDown.customerName || '';
       this.customerGroupID = customerCustomerGroupDropDown.customerGroupID || '';
       this.customerGroup = customerCustomerGroupDropDown.customerGroup || '';
       this.tallyCustomerID = customerCustomerGroupDropDown.tallyCustomerID
         ?? customerCustomerGroupDropDown.TallyCustomerID
         ?? 0;
       this.tallyIntegrationCode = customerCustomerGroupDropDown.tallyIntegrationCode
         ?? customerCustomerGroupDropDown.TallyIntegrationCode
         ?? String(this.tallyCustomerID || '');
    }
  }
  
}

