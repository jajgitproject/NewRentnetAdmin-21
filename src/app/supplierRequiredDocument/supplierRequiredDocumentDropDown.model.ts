// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierRequiredDocumentDropDown {
   supplierRequiredDocumentID: number;
   documentID: number;

  constructor(supplierRequiredDocumentDropDown) {
    {
       this.supplierRequiredDocumentID = supplierRequiredDocumentDropDown.supplierRequiredDocumentID || -1;
       this.documentID = supplierRequiredDocumentDropDown.documentID || '';
    }
  }
  
}

