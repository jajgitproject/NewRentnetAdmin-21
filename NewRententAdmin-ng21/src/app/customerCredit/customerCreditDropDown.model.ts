// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerCreditDropDown {
   customerCreditID: number;
   supplierContractID: string;

  constructor(customerCreditDropDown) {
    {
       this.customerCreditID = customerCreditDropDown.customerCreditID || -1;
       this.supplierContractID = customerCreditDropDown.supplierContractID || '';
    }
  }
  
}

