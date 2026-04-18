// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerPersonDocumentDropDown {
   customerPersonDocumentID: number;
   supplierContractID: string;

  constructor(customerPersonDocumentDropDown) {
    {
       this.customerPersonDocumentID = customerPersonDocumentDropDown.customerPersonDocumentID || -1;
       this.supplierContractID = customerPersonDocumentDropDown.supplierContractID || '';
    }
  }
  
}

