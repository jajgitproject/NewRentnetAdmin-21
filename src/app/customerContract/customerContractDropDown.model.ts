// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerContractDropDown {
 
   customerContractID: number;
   customerContractName: string;

  constructor(customerContractDropDown) {
    {
       this.customerContractID = customerContractDropDown.customerContractID || -1;
       this.customerContractName = customerContractDropDown.customerContractName || '';
    }
  }
  
}

