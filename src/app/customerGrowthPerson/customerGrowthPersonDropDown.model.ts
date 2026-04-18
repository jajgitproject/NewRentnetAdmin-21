// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerGrowthPersonDropDown {
   customerGrowthPersonID: number;
   supplierContractID: string;

  constructor(customerGrowthPersonDropDown) {
    {
       this.customerGrowthPersonID = customerGrowthPersonDropDown.customerGrowthPersonID || -1;
       this.supplierContractID = customerGrowthPersonDropDown.supplierContractID || '';
    }
  }
  
}

