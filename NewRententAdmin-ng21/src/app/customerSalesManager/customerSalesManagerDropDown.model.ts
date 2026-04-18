// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerSalesManagerDropDown {
   customerSalesManagerID: number;
   supplierContractID: string;

  constructor(customerSalesManagerDropDown) {
    {
       this.customerSalesManagerID = customerSalesManagerDropDown.customerSalesManagerID || -1;
       this.supplierContractID = customerSalesManagerDropDown.supplierContractID || '';
    }
  }
  
}

