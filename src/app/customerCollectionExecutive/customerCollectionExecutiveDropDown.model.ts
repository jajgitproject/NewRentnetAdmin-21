// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerCollectionExecutiveDropDown {
   customerCollectionExecutiveID: number;
   supplierContractID: string;

  constructor(customerCollectionExecutiveDropDown) {
    {
       this.customerCollectionExecutiveID = customerCollectionExecutiveDropDown.customerCollectionExecutiveID || -1;
       this.supplierContractID = customerCollectionExecutiveDropDown.supplierContractID || '';
    }
  }
  
}

