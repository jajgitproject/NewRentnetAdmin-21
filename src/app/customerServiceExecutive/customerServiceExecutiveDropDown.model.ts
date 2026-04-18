// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerServiceExecutiveDropDown {
   customerServiceExecutiveID: number;
   supplierContractID: string;

  constructor(customerServiceExecutiveDropDown) {
    {
       this.customerServiceExecutiveID = customerServiceExecutiveDropDown.customerServiceExecutiveID || -1;
       this.supplierContractID = customerServiceExecutiveDropDown.supplierContractID || '';
    }
  }
  
}

