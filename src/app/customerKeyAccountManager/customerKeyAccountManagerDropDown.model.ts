// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerKeyAccountManagerDropDown {
   customerKeyAccountManagerID: number;
   supplierContractID: string;

  constructor(customerKeyAccountManagerDropDown) {
    {
       this.customerKeyAccountManagerID = customerKeyAccountManagerDropDown.customerKeyAccountManagerID || -1;
       this.supplierContractID = customerKeyAccountManagerDropDown.supplierContractID || '';
    }
  }
  
}

