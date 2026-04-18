// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerContractMappingDropDown {
   customerContractMappingID: number;
   supplierContractID: string;

  constructor(customerContractMappingDropDown) {
    {
       this.customerContractMappingID = customerContractMappingDropDown.customerContractMappingID || -1;
       this.supplierContractID = customerContractMappingDropDown.supplierContractID || '';
    }
  }
  
}

