// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerPersonDocumentVerificationDropDown {
   customerPersonDocumentVerificationID: number;
   supplierContractID: string;

  constructor(customerPersonDocumentVerificationDropDown) {
    {
       this.customerPersonDocumentVerificationID = customerPersonDocumentVerificationDropDown.customerPersonDocumentVerificationID || -1;
       this.supplierContractID = customerPersonDocumentVerificationDropDown.supplierContractID || '';
    }
  }
  
}

