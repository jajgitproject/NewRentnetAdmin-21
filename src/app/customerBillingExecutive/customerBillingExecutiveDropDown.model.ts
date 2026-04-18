// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerBillingExecutiveDropDown {
   customerBillingExecutiveID: number;
   supplierContractID: string;

  constructor(customerBillingExecutiveDropDown) {
    {
       this.customerBillingExecutiveID = customerBillingExecutiveDropDown.customerBillingExecutiveID || -1;
       this.supplierContractID = customerBillingExecutiveDropDown.supplierContractID || '';
    }
  }
  
}

